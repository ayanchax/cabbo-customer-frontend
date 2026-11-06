import test from "node:test";
import assert from "node:assert/strict";
import { resolveBookingReturn } from "../src/payments/bookingNavigation.js";
import { restoreSupportContext } from "../src/payments/supportRecovery.js";
import { PAYMENT_PHASE, PAYMENT_FOREGROUND_LIMIT_MS } from "../src/payments/constants.js";
import { withAppServer } from "./app-module-loader.mjs";
const {
  PaymentReconciliation,
  paymentPollDelay, readPending, pendingStorageKey,
} = await withAppServer((server) => server.ssrLoadModule("/src/payments/reconciliation.js"));

const flush = async () => { for (let i = 0; i < 12; i += 1) await Promise.resolve(); };
const checking = { state: "checking", retry_after_seconds: 3 };
const booked = { state: "booked", booking_id: "booking-1", trip_id: "trip-1", trip_status: "confirmed" };
function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}
function harness({ reconcile = async () => checking, getStatus = async () => checking } = {}) {
  const jobs = new Map();
  let clock = 0;
  let jobId = 0;
  const calls = [];
  const views = [];
  const destinations = [];
  let cleared = 0;
  const coordinator = new PaymentReconciliation({
    reconcile: async (...args) => { calls.push(["POST", ...args]); return reconcile(...args); },
    getStatus: async (...args) => { calls.push(["GET", ...args]); return getStatus(...args); },
    onChange: (view) => views.push(view),
    onBooked: (status) => destinations.push(status),
    clearPending: () => { cleared += 1; },
    setTimer: (fn, delay) => { jobs.set(++jobId, { fn, time: clock + delay }); return jobId; },
    clearTimer: (id) => jobs.delete(id),
  });
  const advance = async (duration) => {
    const target = clock + duration;
    for (;;) {
      const next = [...jobs].filter(([, job]) => job.time <= target).sort((a, b) => a[1].time - b[1].time)[0];
      if (!next) break;
      clock = next[1].time;
      jobs.delete(next[0]);
      next[1].fn();
      await flush();
    }
    clock = target;
    await flush();
  };
  return { coordinator, calls, views, destinations, jobs, advance, get cleared() { return cleared; } };
}

test("checking POST (202) is not confirmation; immediately GET and use response delay", async () => {
  const h = harness();
  h.coordinator.start("temp", { postFirst: true });
  h.coordinator.start("temp", { postFirst: true });
  await flush();
  assert.deepEqual(h.calls.map(([method]) => method), ["POST", "GET"]);
  assert.equal(h.destinations.length, 0);
  await h.advance(2999);
  assert.equal(h.calls.length, 2);
  await h.advance(1);
  assert.equal(h.calls.length, 3);
});

test("a booked POST navigates once without polling, even for cancelled/completed trips", async () => {
  for (const trip_status of ["confirmed", "cancelled", "completed"]) {
    const h = harness({ reconcile: async () => ({ ...booked, trip_status }) });
    h.coordinator.start("temp", { postFirst: true });
    await flush();
    assert.equal(h.calls.length, 1);
    assert.equal(h.destinations[0].trip_status, trip_status);
    assert.equal(h.cleared, 1);
    assert.equal(h.jobs.size, 0);
  }
});

test("review_required stops and retains a reference without offering another payment", async () => {
  const h = harness({ getStatus: async () => ({ state: "review_required", message: "Contact support" }) });
  h.coordinator.start("temp");
  await flush();
  assert.equal(h.views.at(-1).phase, PAYMENT_PHASE.REVIEW);
  assert.equal(h.cleared, 0);
  assert.equal(h.jobs.size, 0);
});

test("booked without booking_id or trip_status is recoverable, never guesses a URL", async () => {
  for (const status of [{ state: "booked", trip_id: "trip" }, { state: "booked", booking_id: "booking" }]) {
    const h = harness({ getStatus: async () => status });
    h.coordinator.start("temp");
    await flush();
    assert.equal(h.views.at(-1).phase, PAYMENT_PHASE.REFERENCE);
    assert.equal(h.destinations.length, 0);
    assert.equal(h.cleared, 0);
  }
});

test("lost POST response polls and retries reconciliation at most once", async () => {
  const h = harness({ reconcile: async () => { throw new Error("timeout"); } });
  h.coordinator.start("temp", { postFirst: true });
  await flush();
  assert.deepEqual(h.calls.map(([method]) => method), ["POST", "GET"]);
  await h.advance(30000);
  assert.equal(h.calls.filter(([method]) => method === "POST").length, 2);
  assert.equal(h.destinations.length, 0);
});

test("reload starts with GET, queues reconciliation only when still checking", async () => {
  const h = harness();
  h.coordinator.start("temp");
  await flush();
  assert.deepEqual(h.calls.map(([method]) => method), ["GET"]);
  await h.advance(3000);
  assert.deepEqual(h.calls.map(([method]) => method), ["GET", "POST", "GET"]);
});

test("sequential polling never overlaps a slow request", async () => {
  const slow = deferred();
  const h = harness({ getStatus: () => slow.promise });
  h.coordinator.start("temp", { postFirst: true });
  await flush();
  await h.advance(25000);
  assert.equal(h.calls.length, 2);
  slow.resolve(checking);
  await flush();
  await h.advance(3000);
  assert.equal(h.calls.length, 3);
});

test("waiting limit aborts an in-flight read and ignores its eventual success", async () => {
  const slow = deferred();
  const h = harness({ getStatus: () => slow.promise });
  h.coordinator.start("temp");
  await h.advance(PAYMENT_FOREGROUND_LIMIT_MS);
  assert.equal(h.views.at(-1).phase, PAYMENT_PHASE.WAITING);
  assert.equal(h.calls[0][2].aborted, true);
  slow.resolve(booked);
  await flush();
  assert.equal(h.destinations.length, 0);
  assert.equal(h.jobs.size, 0);
});

test("unmount/account change aborts and ignores stale responses from previous cycle", async () => {
  const slow = deferred();
  const h = harness({ getStatus: (id) => id === "old" ? slow.promise : checking });
  h.coordinator.start("old");
  h.coordinator.stop();
  h.coordinator.start("new");
  await flush();
  slow.resolve(booked);
  await flush();
  assert.equal(h.calls[0][2].aborted, true);
  assert.equal(h.views.at(-1).reference, "new");
  assert.equal(h.destinations.length, 0);
});

test("Strict Mode stop/start resumes with GET and avoids duplicate POST", async () => {
  const slow = deferred();
  const h = harness({ reconcile: () => slow.promise });
  h.coordinator.start("temp", { postFirst: true });
  h.coordinator.stop();
  h.coordinator.start("temp");
  await flush();
  assert.deepEqual(h.calls.map(([method]) => method), ["POST", "GET"]);
  slow.resolve(booked);
  await flush();
  assert.equal(h.destinations.length, 0);
});

test("persistent access/reference errors stop; 401 delegates to session recovery", async () => {
  for (const code of [401, 403, 404]) {
    const h = harness({ getStatus: async () => {
      throw { response: { status: code, data: code === 401 ? { error_code: "UNAUTHORIZED" } : {} } };
    } });
    h.coordinator.start("temp");
    await flush();
    await h.advance(10000);
    assert.equal(h.views.at(-1).phase, code === 401 ? PAYMENT_PHASE.AUTH : PAYMENT_PHASE.ACCESS);
    assert.equal(h.destinations.length, 0);
    assert.equal(h.jobs.size, 0);
  }
});

test("network/server errors remain unresolved and eventually show waiting", async () => {
  const h = harness({ getStatus: async () => { throw new Error("offline"); } });
  h.coordinator.start("temp");
  await h.advance(PAYMENT_FOREGROUND_LIMIT_MS);
  assert.equal(h.views.at(-1).phase, PAYMENT_PHASE.WAITING);
  assert.equal(h.cleared, 0);
});

test("polling falls back to ten seconds for absent or invalid delays", () => {
  for (const retry_after_seconds of [undefined, null, -1, 0, "1", Infinity]) {
    assert.equal(paymentPollDelay({ retry_after_seconds }), 10000);
  }
  assert.equal(paymentPollDelay({ retry_after_seconds: 20 }), 20000);
});

test("stored references are scoped to the authenticated account and contain only identifiers", () => {
  const data = new Map([[pendingStorageKey("alice"), { temp_trip_id: "temp", token: "ignored" }]]);
  const getItem = (key) => data.get(key);
  assert.deepEqual(readPending(getItem, "alice"), { temp_trip_id: "temp" });
  assert.equal(readPending(getItem, "bob"), null);
  assert.equal(readPending(getItem, ""), null);
  data.set(pendingStorageKey("alice"), "bad JSON");
  assert.equal(readPending(getItem, "alice"), null);
});

test("manual status checking after waiting does not POST again after an accepted reconciliation", async () => {
  const h = harness();
  h.coordinator.start("temp", { postFirst: true });
  await flush();
  await h.advance(PAYMENT_FOREGROUND_LIMIT_MS);
  assert.equal(h.views.at(-1).phase, PAYMENT_PHASE.WAITING);
  h.coordinator.start("temp");
  await flush();
  await h.advance(20000);
  assert.equal(h.calls.filter(([method]) => method === "POST").length, 1);
});

test("wrong-reference responses are ignored and never navigate or clear recovery", async () => {
  const h = harness({ getStatus: async () => ({ ...booked, temp_trip_id: "different" }) });
  h.coordinator.start("temp");
  await flush();
  assert.equal(h.destinations.length, 0);
  assert.equal(h.cleared, 0);
  await h.advance(PAYMENT_FOREGROUND_LIMIT_MS);
  assert.equal(h.views.at(-1).phase, PAYMENT_PHASE.WAITING);
});

test("non-retryable reconciliation errors do not cause repeated POSTs", async () => {
  const h = harness({ reconcile: async () => { throw { response: { status: 403 } }; } });
  h.coordinator.start("temp", { postFirst: true });
  await flush();
  await h.advance(30000);
  assert.equal(h.calls.filter(([method]) => method === "POST").length, 1);
});

test("default timers preserve the browser global receiver during start and cleanup", async (t) => {
  const scheduled = [];
  const cleared = [];
  t.mock.method(globalThis, "setTimeout", function (callback, delay) {
    assert.equal(this, globalThis, "setTimeout requires its browser global receiver");
    scheduled.push({ callback, delay });
    return scheduled.length;
  });
  t.mock.method(globalThis, "clearTimeout", function (timer) {
    assert.equal(this, globalThis, "clearTimeout requires its browser global receiver");
    cleared.push(timer);
  });
  const coordinator = new PaymentReconciliation({
    reconcile: async () => checking,
    getStatus: async () => checking,
    onChange: () => {},
    onBooked: () => {},
    clearPending: () => {},
  });
  assert.doesNotThrow(() => coordinator.stop());
  coordinator.start("temp", { postFirst: true });
  await flush();
  assert.deepEqual(scheduled.map(({ delay }) => delay), [PAYMENT_FOREGROUND_LIMIT_MS, 3000]);
  assert.doesNotThrow(() => coordinator.stop());
  assert.ok(cleared.includes(1));
  assert.ok(cleared.includes(2));
});

test("confirmation back navigation restores the original trip-page state for all trip types", () => {
  for (const [pathname, trip_type, requiresDropoff] of [
    ["/local-hourly-rental", "local", false],
    ["/airport-transfers", "airport_pickup", true],
    ["/airport-transfers", "airport_drop", true],
    ["/outstation", "outstation", true],
  ]) {
    const state = { pickup: { place_id: "pickup", region_code: "test" }, trip_type };
    if (requiresDropoff) state.dropoff = { place_id: "dropoff" };
    const original = { pathname, search: "?source=home", hash: "#options", state };
    // Browser history state survives the booking -> checking -> details replacements/reload.
    const restored = JSON.parse(JSON.stringify({ fromBookingConfirmation: true, bookingReturnTo: original }));
    const result = resolveBookingReturn(restored.bookingReturnTo, pathname, "/", requiresDropoff);
    assert.deepEqual(result.to, { pathname, search: original.search, hash: original.hash });
    assert.deepEqual(result.options, { replace: true, state });
  }
});

test("confirmation recovery without valid trip-page state returns home instead of crashing", () => {
  for (const returnTo of [null, { pathname: "/local-hourly-rental" },
    { pathname: "/local-hourly-rental", state: {} },
    { pathname: "/unexpected", state: { pickup: {} } }]) {
    assert.deepEqual(resolveBookingReturn(returnTo, "/local-hourly-rental", "/", false),
      { to: "/", options: { replace: true } });
  }
  for (const state of [{ pickup: {}, trip_type: "airport_pickup" }, { pickup: {}, dropoff: {} }]) {
    assert.equal(resolveBookingReturn({ pathname: "/airport-transfers", state }, "/airport-transfers", "/", true).to, "/");
  }
});

test("refresh restores support context from history state for the pending customer and booking", () => {
  const supportContext = { origin: { place_id: "pickup", region_code: "test" }, tripType: "local", tripLabel: "Hourly rental" };
  const historyState = JSON.parse(JSON.stringify({ paymentSupport: {
    owner: "alice", temp_trip_id: "temp", supportContext,
  } }));
  assert.deepEqual(restoreSupportContext(historyState.paymentSupport, "alice", "temp"), supportContext);
  assert.equal(restoreSupportContext(historyState.paymentSupport, "bob", "temp"), null);
  assert.equal(restoreSupportContext(historyState.paymentSupport, "alice", "another-booking"), null);
  assert.equal(restoreSupportContext(historyState.paymentSupport, "alice", undefined), null);
});

test("missing or incomplete support history keeps the generic support fallback", () => {
  for (const supportContext of [undefined, {}, { origin: {} }, { tripType: "local" }]) {
    assert.equal(restoreSupportContext({ owner: "alice", temp_trip_id: "temp", supportContext }, "alice", "temp"), null);
  }
  assert.equal(restoreSupportContext(null, "alice", "temp"), null);
});

test("explicit TRIP_NOT_FOUND from status clears the stale pending lock and stops requests", async () => {
  const h = harness({ getStatus: async () => {
    throw { response: { status: 404, data: { error_code: "TRIP_NOT_FOUND", detail: "Booking not found" } } };
  } });
  h.coordinator.start("missing-temp");
  await flush();
  assert.deepEqual(h.views.at(-1), { phase: PAYMENT_PHASE.MISSING, reference: "missing-temp" });
  assert.equal(h.cleared, 1);
  assert.equal(h.jobs.size, 0);
  assert.equal(h.destinations.length, 0);
  await h.advance(PAYMENT_FOREGROUND_LIMIT_MS);
  assert.deepEqual(h.calls.map(([method]) => method), ["GET"]);
});

test("a POST not-found response is verified with GET before releasing the lock", async () => {
  const h = harness({
    reconcile: async () => { throw { response: { status: 404, data: { error_code: "TRIP_NOT_FOUND" } } }; },
  });
  h.coordinator.start("temp", { postFirst: true });
  await flush();
  assert.deepEqual(h.calls.map(([method]) => method), ["POST", "GET"]);
  assert.equal(h.cleared, 0);
  assert.equal(h.views.at(-1).phase, PAYMENT_PHASE.CHECKING);
});

test("403 and generic or unrelated 404 errors never clear the pending record", async () => {
  for (const [status, error_code] of [[403, "TRIP_NOT_FOUND"], [404, undefined], [404, "ENDPOINT_NOT_FOUND"]]) {
    const h = harness({ getStatus: async () => { throw { response: { status, data: { error_code } } }; } });
    h.coordinator.start("temp");
    await flush();
    await h.advance(10000);
    assert.equal(h.views.at(-1).phase, PAYMENT_PHASE.ACCESS);
    assert.equal(h.cleared, 0);
  }
});
