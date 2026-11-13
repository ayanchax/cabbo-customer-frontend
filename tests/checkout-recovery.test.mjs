import test from "node:test";
import assert from "node:assert/strict";
import { checkoutRecoveryAction } from "../src/payments/checkoutRecovery.js";
import { CHECKOUT_RECOVERY_ACTION } from "../src/payments/constants.js";

test("an old pending booking does not block a different reservation", () => {
  const oldPending = { temp_trip_id: "old-trip" };
  assert.equal(checkoutRecoveryAction(oldPending, "new-trip"), CHECKOUT_RECOVERY_ACTION.START);
});

test("the same pending booking goes to recovery instead of reopening payment", () => {
  assert.equal(checkoutRecoveryAction({ temp_trip_id: "same-trip" }, "same-trip"), CHECKOUT_RECOVERY_ACTION.RECOVER);
});

test("an active checkout blocks overlapping modals, even for a different order", () => {
  const pending = { temp_trip_id: "active-trip" };
  assert.equal(checkoutRecoveryAction(pending, "active-trip", true), CHECKOUT_RECOVERY_ACTION.BUSY);
  assert.equal(checkoutRecoveryAction(pending, "another-trip", true), CHECKOUT_RECOVERY_ACTION.BUSY);
});

test("a new checkout becomes the recovery target without blocking the older backend trip", () => {
  let pending = { temp_trip_id: "old-trip" };
  assert.equal(checkoutRecoveryAction(pending, "new-trip"), CHECKOUT_RECOVERY_ACTION.START);
  pending = { temp_trip_id: "new-trip" };
  assert.equal(checkoutRecoveryAction(pending, "new-trip"), CHECKOUT_RECOVERY_ACTION.RECOVER);
  assert.equal(checkoutRecoveryAction(pending, "next-trip"), CHECKOUT_RECOVERY_ACTION.START);
});

test("without a saved checkout a new reservation can start", () => {
  assert.equal(checkoutRecoveryAction(null, "new-trip"), CHECKOUT_RECOVERY_ACTION.START);
});

test("an observed dismissal permits reopening only its own order, while refresh still recovers", () => {
  const pending = { temp_trip_id: "dismissed-trip" };
  assert.equal(checkoutRecoveryAction(pending, "dismissed-trip", false, "dismissed-trip"), CHECKOUT_RECOVERY_ACTION.START);
  assert.equal(checkoutRecoveryAction(pending, "dismissed-trip", true, "dismissed-trip"), CHECKOUT_RECOVERY_ACTION.BUSY);
  assert.equal(checkoutRecoveryAction(pending, "dismissed-trip", false, "other-trip"), CHECKOUT_RECOVERY_ACTION.RECOVER);
  assert.equal(checkoutRecoveryAction(pending, "dismissed-trip"), CHECKOUT_RECOVERY_ACTION.RECOVER);
});
