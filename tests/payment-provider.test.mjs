import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement as h, lazy, Suspense, useContext } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Window } from "happy-dom";
import { withAppServer } from "./app-module-loader.mjs";

// Exercise the real provider/router/effects; only external services and visuals are replaced.
const mocks = {
  "@/hooks": `
    export const useCustomer = () => ({ customer: { id: 'alice' } });
    export const useLocalStorage = () => globalThis.paymentProviderTest.storage;
    export const useOverlay = () => globalThis.paymentProviderTest.overlay;
    export const useAnalytics = () => globalThis.paymentProviderTest.analytics;
    export const useInitiateTripBookingMutation = () => globalThis.paymentProviderTest.bookingApi;
  `,
  "@/analytics": `
    export const ANALYTICS_EVENTS = { PAYMENT_STARTED: 'started', BOOKING_CONFIRMED: 'confirmed' };
    export const useAnalytics = () => globalThis.paymentProviderTest.analytics;
  `,
  "@/api/payment": `
    export const reconcilePayment = (...args) => globalThis.paymentProviderTest.reconcile(...args);
    export const getPaymentStatus = (...args) => globalThis.paymentProviderTest.getStatus(...args);
  `,
  "@/components": `
    import { createElement } from 'react';
    export const SuccessOverlay = ({ message }) => createElement('div', { 'data-success': true }, message);
    export const Loader = () => createElement('p', null, 'Preparing booking');
    export const FeedbackState = ({ title, message, primaryAction, secondaryAction }) =>
      createElement('section', { 'data-feedback': true }, title, message, primaryAction, secondaryAction);
  `,
  "@/features/localHourlyRental/LocalHourlyRentalBooking": `
    import { createElement } from 'react';
    export const LocalHourlyRentalBooking = () => createElement('p', null, 'Review details');
  `,
};
const mockServices = {
  name: "payment-provider-test-services",
  enforce: "pre",
  resolveId(source, importer) {
    const alias = source.replaceAll("\\", "/").replace(/^.*\/src\//, "@/");
    if (/\/src\/(payments\/PaymentProvider|pages\/BookingPage)\.jsx$/.test(importer?.replaceAll("\\", "/") || "") && alias in mocks) {
      return `\0payment-test:${alias}`;
    }
  },
  load(id) {
    if (id.startsWith("\0payment-test:")) return mocks[id.slice("\0payment-test:".length)];
  },
};

test("checkout dismissal, lazy confirmation, and restored review use the correct recovery paths", async () => {
  const window = new Window({ url: "http://localhost:5173" });
  const previousGlobals = new Map();
  for (const [key, value] of Object.entries({
    window, document: window.document, navigator: window.navigator,
    HTMLElement: window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true,
  })) {
    previousGlobals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  const saved = new Map();
  const requests = [];
  const events = [];
  let checkoutOptions;
  let root;
  window.Razorpay = class {
    constructor(options) { checkoutOptions = options; }
    open() {}
    close() {}
  };
  globalThis.paymentProviderTest = {
    storage: {
      getItem: (key) => saved.get(key),
      setItem: (key, value) => { saved.set(key, value); return true; },
      removeItem: (key) => saved.delete(key),
    },
    overlay: { showOverlay() {}, hideOverlay() {} },
    analytics: { track: (event) => events.push(event) },
    reconcile: async (reference) => {
      requests.push(["POST", reference]);
      return { temp_trip_id: reference, state: "booked", booking_id: "RENTAL-fast", trip_status: "confirmed" };
    },
    getStatus: async () => { throw new Error("An already booked POST must not need polling"); },
  };
  try {
    await withAppServer(async (server) => {
      const { PaymentProvider } = await server.ssrLoadModule("/src/payments/PaymentProvider.jsx");
      const { PaymentContext } = await server.ssrLoadModule("/src/payments/PaymentContext.js");
      const { ROUTES, TRIP_TYPES, PAYMENT_ORDER_STATUS } = await server.ssrLoadModule("/src/utils/index.js");
      const { PayAndConfirmBooking } = await server.ssrLoadModule("/src/components/PayAndConfirmBooking.jsx");
      let payment;
      let location;
      let navigate;
      function Probe({ showPayment = true }) {
        payment = useContext(PaymentContext);
        location = useLocation();
        navigate = useNavigate();
        return showPayment ? h(PayAndConfirmBooking, { orderData: {
          trip_id: "temp-fast", status: PAYMENT_ORDER_STATUS.CREATED,
        } }) : null;
      }
      let loadPendingPage;
      const PendingPage = lazy(() => new Promise((resolve) => { loadPendingPage = resolve; }));
      const container = document.createElement("div");
      document.body.appendChild(container);
      root = createRoot(container);
      await act(async () => root.render(h(MemoryRouter, { initialEntries: [ROUTES.BOOKING] },
        h(Suspense, { fallback: h("p", null, "Loading route") },
          h(PaymentProvider, null, h(Probe), h(Routes, null,
            h(Route, { path: ROUTES.BOOKING, element: h("p", null, "Checkout") }),
            h(Route, { path: ROUTES.PAYMENT_PENDING_CONFIRMATION, element: h(PendingPage) }),
            h(Route, { path: ROUTES.BOOKING_DETAIL, element: h("p", null, "Booking details") }),
            h(Route, { path: ROUTES.HOME, element: h("p", null, "Home") }),
          ))))));
      await act(async () => payment.onPay({ trip_id: "temp-fast", order_id: "order-test" }));
      assert.equal(container.querySelector("button").disabled, true);
      const dismissedCheckout = checkoutOptions;
      await act(async () => dismissedCheckout.modal.ondismiss());
      await act(async () => dismissedCheckout.modal.ondismiss());
      assert.equal(location.pathname, ROUTES.BOOKING);
      assert.deepEqual(requests, [], "Closing checkout must not call reconciliation");
      assert.equal(saved.size, 1, "Dismissal does not prove that no payment is in flight");
      assert.equal(container.querySelector("button").disabled, false);
      assert.match(container.querySelector("button").textContent, /Pay & Confirm Booking/);
      assert.doesNotMatch(container.textContent, /Check booking status/);

      await act(async () => payment.onPay({ trip_id: "temp-fast", order_id: "order-test" }));
      assert.notEqual(checkoutOptions, dismissedCheckout, "The same order opens a new checkout instance");
      assert.equal(checkoutOptions.order_id, "order-test");
      await act(async () => dismissedCheckout.handler());
      assert.equal(location.pathname, ROUTES.BOOKING, "Callbacks from a dismissed instance cannot finish a later checkout");
      await act(async () => checkoutOptions.handler());
      await act(async () => checkoutOptions.modal.ondismiss());
      assert.equal(typeof loadPendingPage, "function", "Navigation has reached the unresolved lazy page");
      assert.deepEqual(requests, [], "Do not reconcile while the destination route is suspended");
      assert.equal(saved.size, 1, "Recovery must survive the route-loading gap");

      await act(async () => loadPendingPage({ default: () => h("p", null, "Checking payment") }));
      assert.deepEqual(requests, [["POST", "temp-fast"]]);
      assert.equal(location.pathname, ROUTES.BOOKING_DETAIL.replace(":bookingId", "RENTAL-fast"));
      assert.match(container.textContent, /Booking details/);
      assert.match(container.textContent, /Booking confirmed/);
      assert.equal(saved.size, 0);
      assert.equal(events.filter((event) => event === "confirmed").length, 1);

      // Existing background recovery guard: browsing away must not be hijacked.
      let resolveStatus;
      globalThis.paymentProviderTest.getStatus = () => new Promise((resolve) => { resolveStatus = resolve; });
      await act(async () => navigate(ROUTES.BOOKING));
      await act(async () => payment.onPay({ trip_id: "temp-slow", order_id: "order-next" }));
      globalThis.paymentProviderTest.reconcile = async () => ({ state: "checking" });
      await act(async () => checkoutOptions.handler());
      await act(async () => navigate(ROUTES.HOME));
      await act(async () => resolveStatus({ state: "booked", booking_id: "RENTAL-background", trip_status: "confirmed" }));
      assert.equal(location.pathname, ROUTES.HOME);
      assert.equal(events.filter((event) => event === "confirmed").length, 1);

      const { default: BookingPage } = await server.ssrLoadModule("/src/pages/BookingPage.jsx");
      const { pendingStorageKey } = await server.ssrLoadModule("/src/payments/reconciliation.js");
      const renderRefreshedReview = async ({ status, error, initiationError, savedReference = "temp-fast" }) => {
        await act(async () => root.unmount());
        saved.clear();
        if (savedReference) saved.set(pendingStorageKey("alice"), { temp_trip_id: savedReference });
        requests.length = 0;
        globalThis.paymentProviderTest.bookingApi = {
          mutateAsync: async () => {
            if (initiationError) throw initiationError;
            return { data: { trip_id: "temp-fast", order_id: "order-test", status: PAYMENT_ORDER_STATUS.CREATED } };
          },
        };
        globalThis.paymentProviderTest.getStatus = async (reference) => {
          requests.push(["GET", reference]);
          if (error) throw error;
          return status;
        };
        globalThis.paymentProviderTest.reconcile = async () => {
          requests.push(["POST"]);
          throw new Error("Restoring review must not reconcile");
        };
        root = createRoot(container);
        await act(async () => root.render(h(MemoryRouter, { initialEntries: [{ pathname: ROUTES.BOOKING,
          state: { bookingPayload: { option: {}, preferences: { trip_type: TRIP_TYPES.LOCAL } } },
        }] }, h(PaymentProvider, null, h(Probe, { showPayment: !initiationError }), h(Routes, null,
          h(Route, { path: ROUTES.BOOKING, element: h(BookingPage) }),
          h(Route, { path: ROUTES.BOOKING_DETAIL, element: h("p", null, "Booking details") }),
          h(Route, { path: ROUTES.PAYMENT_PENDING_CONFIRMATION, element: h("p", null, "Checking booking") }),
          h(Route, { path: ROUTES.MY_TRIPS, element: h("p", null, "Upcoming Trips") }),
          h(Route, { path: ROUTES.HOME, element: h("p", null, "Home") }),
        )))));
      };
      await renderRefreshedReview({ status: { state: "checking", can_retry_payment: true } });
      assert.deepEqual(requests, [["GET", "temp-fast"]]);
      assert.equal(location.pathname, ROUTES.BOOKING);
      assert.equal(container.querySelector("button").disabled, false);
      assert.doesNotMatch(container.textContent, /Check booking status/);
      await act(async () => payment.onPay({ trip_id: "temp-fast", order_id: "order-test" }));
      assert.equal(checkoutOptions.order_id, "order-test");
      assert.deepEqual(requests, [["GET", "temp-fast"]], "Reopening the restored order sends no reconciliation request");

      for (const status of [
        { state: "checking", can_retry_payment: false },
        { state: "checking" },
        { state: "review_required", can_retry_payment: true },
        { state: "booked", can_retry_payment: true },
        { state: "checking", temp_trip_id: "wrong-trip", can_retry_payment: true },
      ]) {
        await renderRefreshedReview({ status });
        assert.deepEqual(requests, [["GET", "temp-fast"]]);
        assert.equal(container.querySelector("button").disabled, true);
        assert.match(container.textContent, /Check booking status/);
        assert.equal(saved.size, 1);
      }
      await renderRefreshedReview({ error: new Error("Network unavailable") });
      assert.deepEqual(requests, [["GET", "temp-fast"]]);
      assert.equal(container.querySelector("button").disabled, true);
      assert.equal(saved.size, 1);

      let resolveOldReview;
      await renderRefreshedReview({ status: new Promise((resolve) => { resolveOldReview = resolve; }) });
      await act(async () => payment.onPay({ trip_id: "new-trip", order_id: "new-order" }));
      await act(async () => resolveOldReview({ state: "checking", can_retry_payment: true }));
      assert.equal(payment.view.phase, "checkout", "A late review response cannot unlock an active checkout");
      assert.equal(payment.pending.temp_trip_id, "new-trip");

      for (const savedReference of [null, "unrelated-trip"]) {
        await renderRefreshedReview({ savedReference });
        assert.deepEqual(requests, [], "New or unrelated reservations do not check the old payment");
        assert.equal(container.querySelector("button").disabled, false);
      }
      await renderRefreshedReview({ status: {
        state: "booked", booking_id: "RENTAL-restored", trip_status: "confirmed", can_retry_payment: false,
      } });
      assert.deepEqual(requests, [["GET", "temp-fast"]]);
      assert.equal(location.pathname, ROUTES.BOOKING_DETAIL.replace(":bookingId", "RENTAL-restored"));
      assert.match(container.textContent, /Booking confirmed/);
      assert.equal(saved.size, 0);

      const conflict = { response: { status: 409, data: {
        error_code: "GENERIC_EXCEPTION",
        detail: "Payment status is unresolved. Please check your booking before retrying payment.",
      } } };
      await renderRefreshedReview({ initiationError: conflict, status: {
        state: "booked", booking_id: "RENTAL-recovered", trip_status: "confirmed",
      } });
      assert.equal(location.pathname, ROUTES.BOOKING);
      assert.match(container.textContent, /We couldn't continue this booking/);
      assert.match(container.textContent, /Please check your booking status or Upcoming Trips before starting a new booking/);
      assert.doesNotMatch(container.textContent, /Payment status is unresolved/);
      assert.match(container.textContent, /Check booking status/);
      assert.deepEqual(requests, [], "A generic 409 cannot automatically identify the conflicting checkout");
      await act(async () => container.querySelector("[data-feedback] button").click());
      assert.deepEqual(requests, [["GET", "temp-fast"]]);
      assert.equal(location.pathname, ROUTES.BOOKING_DETAIL.replace(":bookingId", "RENTAL-recovered"));

      await renderRefreshedReview({ initiationError: conflict, savedReference: null });
      assert.match(container.textContent, /We couldn't continue this booking/);
      assert.doesNotMatch(container.textContent, /Check booking status/);
      assert.deepEqual(requests, []);
      await act(async () => container.querySelector("[data-feedback] button").click());
      assert.equal(location.pathname, ROUTES.MY_TRIPS);

      await renderRefreshedReview({ initiationError: { response: { status: 409, data: {
        error_code: "ALREADY_BOOKED_ON_THIS_SLOT",
      } } } });
      assert.match(container.textContent, /You already have a booking around this time/);
      assert.doesNotMatch(container.textContent, /Check booking status/);
    }, { plugins: [mockServices] });
  } finally {
    if (root) await act(async () => root.unmount());
    delete globalThis.paymentProviderTest;
    await window.happyDOM.close();
    for (const [key, descriptor] of previousGlobals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
