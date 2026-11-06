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

// Checkout recovery actions; these values must match the API contract.
export const CHECKOUT_RECOVERY_ACTION = Object.freeze({
  START: "start",
  RECOVER: "recover",
  BUSY: "busy",
});

// Constants for payment request timeouts and polling intervals.
export const PAYMENT_POLL_FALLBACK_SECONDS = 10; // Fallback polling interval when the payment status is unknown or the request fails. This is a reasonable interval to avoid overwhelming the server with requests while still providing timely updates to the user. Maximum 6 requests will be made in a minute before giving up, which is a reasonable limit to prevent excessive polling and server load.
export const PAYMENT_FOREGROUND_LIMIT_MS = 60000; // 1 minute is the maximum time we will wait for a payment to complete while the user is actively using the app. This is a reasonable limit to prevent users from waiting indefinitely for a payment to process, and it allows us to handle cases where the payment takes too long due to network issues or other problems.
export const MAX_RECONCILIATION_ATTEMPTS = 2; // The maximum number of times we will attempt to reconcile a payment before giving up. This is a safeguard against infinite loops in case of persistent failures.
export const CHECKOUT_SCRIPT_TIMEOUT_MS = 15000; // 15 seconds is the maximum time we wait for the checkout script to load before we consider it a failure. This is a reasonable timeout for network requests and script loading, and it allows us to handle cases where the script fails to load due to network issues or other problems.
export const BOOKING_SUCCESS_DURATION_MS = 3000; // 3 seconds is the duration we show the booking success message before transitioning to the next phase. This gives users enough time to see the confirmation and feel reassured that their booking was successful.
export const PAYMENT_REQUEST_TIMEOUT_MS = 15000; // 15 seconds is the maximum time we wait for a payment request to complete before we consider it a failure. This is a reasonable timeout for network requests and allows us to handle cases where the payment request takes too long due to network issues or other problems.
