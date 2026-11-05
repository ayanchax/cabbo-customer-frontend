import { CHECKOUT_RECOVERY_ACTION } from "./constants.js";

// A saved checkout belongs to one booking, not every future reservation.
export function checkoutRecoveryAction(pending, tripId, checkoutActive = false) {
  if (checkoutActive) return CHECKOUT_RECOVERY_ACTION.BUSY;
  if (pending?.temp_trip_id && tripId != null && String(pending.temp_trip_id) === String(tripId)) {
    return CHECKOUT_RECOVERY_ACTION.RECOVER; // Recover the checkout for this trip, if it was interrupted.
  }
  return CHECKOUT_RECOVERY_ACTION.START;
}
