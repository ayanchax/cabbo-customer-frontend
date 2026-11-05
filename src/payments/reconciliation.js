import { SERVER_ERROR_CODES, SERVER_STATUS_CODES } from "@/utils";
import {
  PAYMENT_PHASE,
  PAYMENT_STATE,
  PAYMENT_POLL_FALLBACK_SECONDS,
  PAYMENT_FOREGROUND_LIMIT_MS,
  MAX_RECONCILIATION_ATTEMPTS,
} from "./constants.js";

export function paymentPollDelay(status) {
  const seconds = status?.retry_after_seconds;
  return (typeof seconds === "number" && Number.isFinite(seconds) && seconds > 0
    ? seconds : PAYMENT_POLL_FALLBACK_SECONDS) * 1000;
}

export function pendingStorageKey(owner) {
  return `cabbo:pending-payment:${encodeURIComponent(owner)}`;
}

export function readPending(getItem, owner) {
  if (!owner) return null;
  try {
    const value = getItem(pendingStorageKey(owner));
    return typeof value?.temp_trip_id === "string" && value.temp_trip_id
      ? { temp_trip_id: value.temp_trip_id,
        ...(typeof value.booking_id === "string" && value.booking_id ? { booking_id: value.booking_id } : {}) }
      : null;
  } catch {
    return null;
  }
}

// One coordinator per authenticated customer. Provider callbacks carry no payment verdict.
export class PaymentReconciliation {
  constructor({ reconcile, getStatus, onChange, onBooked, clearPending, onReview = () => {},
    // Browser timers require the global receiver, not this coordinator instance.
    setTimer = (callback, delay) => globalThis.setTimeout(callback, delay),
    clearTimer = (timer) => globalThis.clearTimeout(timer) })
  {
    Object.assign(this, { reconcile, getStatus, onChange, onBooked, clearPending, onReview, setTimer, clearTimer });
    this.generation = 0;
    this.postAttempts = 0;
    this.running = false;
  }

  stop() {
    this.running = false;
    this.generation += 1;
    this.clearTimer(this.timer); // cancel any pending poll
    this.clearTimer(this.deadline); // cancel the foreground limit
    this.controller?.abort(); // cancel any pending request
  }

  start(reference, { postFirst = false } = {}) {
    if (this.running && this.reference === reference) return;
    this.stop();
    if (this.reference !== reference) {
      this.postAttempts = 0;
      this.postAccepted = false;
      this.postBlocked = false;
    }
    this.reference = reference;
    this.running = true;
    const generation = this.generation;
    this.controller = new AbortController();
    const active = () => this.running && generation === this.generation;
    this.onChange({ phase: PAYMENT_PHASE.CHECKING, reference });
    this.deadline = this.setTimer(() => {
      if (!active()) return;
      this.stop();
      this.onChange({ phase: PAYMENT_PHASE.WAITING, reference }); // Waiting indicates that the coordinator is still running, but the foreground limit has been reached, no polling is occurring, and the customer may be on another page. The coordinator will resume polling when the customer returns to the confirmation page. However, the backend may still be processing the payment, so the customer may still be able to return to the confirmation page and see a booked or review-required outcome. The coordinator will resume polling when the customer returns to the confirmation page.
    }, PAYMENT_FOREGROUND_LIMIT_MS);

    let accessErrors = 0;
    // A second POST is allowed only after an ambiguous POST error, never per polling tick.
    let retryPost = false;
    const request = async (post = false) => {
      if (!active()) return;
      try {
        if (post) this.postAttempts += 1;
        const status = await (post ? this.reconcile : this.getStatus)(reference, this.controller.signal);
        if (!active()) return;
        if (status?.temp_trip_id && status.temp_trip_id !== reference) {
          throw new Error("Payment status reference does not match");
        }
        if (post) this.postAccepted = true;
        accessErrors = 0;
        if (status?.state === PAYMENT_STATE.BOOKED) {
          this.stop();
          // The detail route consumes booking_id; trip_id is not a safe substitute.
          if (typeof status.booking_id !== "string" || !status.booking_id.trim() ||
              typeof status.trip_status !== "string" || !status.trip_status.trim()) {
            this.onChange({ phase: PAYMENT_PHASE.REFERENCE, reference, status });
            return;
          }
          this.onChange({ phase: PAYMENT_PHASE.BOOKED, reference, status });
          this.onBooked(status);
          this.clearPending();
          return;
        }
        if (status?.state === PAYMENT_STATE.REVIEW_REQUIRED) {
          this.stop();
          // Retain the minimal reference so refresh keeps the review/support outcome.
          this.onChange({ phase: PAYMENT_PHASE.REVIEW, reference, status });
          this.onReview(status, reference);
          return;
        }
        this.onChange({ phase: PAYMENT_PHASE.CHECKING, reference, status });
        if (post) {
          retryPost = false;
          void request(); // Read immediately after an accepted/checking POST.
          return;
        }
        if ((!this.postAccepted && !this.postBlocked) || retryPost) {
          retryPost = false;
          if (this.postAttempts < MAX_RECONCILIATION_ATTEMPTS) {
            this.timer = this.setTimer(() => request(true), paymentPollDelay(status));
            return;
          }
        }
        this.timer = this.setTimer(() => request(), paymentPollDelay(status));
      } catch (error) {
        if (!active()) return;
        const code = error?.response?.status;
        // Only the status endpoint's explicit missing-trip response releases the lock.
        if (!post && code === SERVER_STATUS_CODES.NOT_FOUND && error.response?.data?.error_code === SERVER_ERROR_CODES.TRIP_NOT_FOUND) {
          this.stop();
          this.onChange({ phase: PAYMENT_PHASE.MISSING, reference });
          this.clearPending();
          return;
        }
        if (code === SERVER_STATUS_CODES.UNAUTHORIZED && error.response?.data?.error_code === SERVER_ERROR_CODES.UNAUTHORIZED) {
          this.stop(); // The shared API interceptor owns session recovery.
          this.onChange({ phase: PAYMENT_PHASE.AUTH, reference });
          return;
        }
        if (code === SERVER_STATUS_CODES.FORBIDDEN || code === SERVER_STATUS_CODES.NOT_FOUND) {
          accessErrors += 1;
          if (accessErrors >= 2) {
            // Other access/reference errors stop polling without releasing the payment lock.
            this.stop();
            this.onChange({ phase: PAYMENT_PHASE.ACCESS, reference, code });
            return;
          }
        }
        if (post) {
          retryPost = !code || code >= SERVER_STATUS_CODES.INTERNAL_SERVER_ERROR || code === SERVER_STATUS_CODES.GATEWAY_TIMEOUT;
          this.postBlocked = !retryPost;
          void request(); // POST may have committed even when its response was lost.
          return;
        }
        this.timer = this.setTimer(() => request(
          retryPost && this.postAttempts < MAX_RECONCILIATION_ATTEMPTS,
        ), PAYMENT_POLL_FALLBACK_SECONDS * 1000);
      }
    };
    void request(postFirst && this.postAttempts < MAX_RECONCILIATION_ATTEMPTS);
  }
}
