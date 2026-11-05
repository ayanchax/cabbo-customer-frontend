// Frontend phases used by the coordinator, provider, and payment-status UI.
export const PAYMENT_PHASE = Object.freeze({
  IDLE: "idle",
  CHECKOUT: "checkout",
  CHECKING: "checking",
  WAITING: "waiting",
  BOOKED: "booked",
  REVIEW: "review",
  ACCESS: "access",
  REFERENCE: "reference",
  AUTH: "auth",
  MISSING: "missing",
});

// Backend reconciliation states; these values must match the API contract.
export const PAYMENT_STATE = Object.freeze({
  CHECKING: "checking",
  BOOKED: "booked",
  REVIEW_REQUIRED: "review_required",
});

export const CHECKOUT_RECOVERY_ACTION = Object.freeze({
  START: "start",
  RECOVER: "recover",
  BUSY: "busy",
});

export const PAYMENT_POLL_FALLBACK_SECONDS = 10;
export const PAYMENT_FOREGROUND_LIMIT_MS = 60000;
export const MAX_RECONCILIATION_ATTEMPTS = 2;
export const CHECKOUT_SCRIPT_TIMEOUT_MS = 15000;
export const BOOKING_SUCCESS_DURATION_MS = 3000;
export const PAYMENT_REQUEST_TIMEOUT_MS = 15000;
