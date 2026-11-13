import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCustomer, useLocalStorage, useOverlay } from "@/hooks";
import { APP, DEFAULT_CURRENCY_CODE, ROUTES, TRIP_STATUS } from "@/utils";
import { SuccessOverlay } from "@/components";
import { getPaymentStatus, reconcilePayment } from "@/api/payment";
import { ANALYTICS_EVENTS, useAnalytics } from "@/analytics";
import { PaymentContext } from "./PaymentContext";
import { PaymentReconciliation, pendingStorageKey, readPending } from "./reconciliation";
import { restoreSupportContext } from "./supportRecovery";
import { checkoutRecoveryAction } from "./checkoutRecovery";
import { PAYMENT_PHASE, PAYMENT_STATE, CHECKOUT_RECOVERY_ACTION, CHECKOUT_SCRIPT_TIMEOUT_MS, BOOKING_SUCCESS_DURATION_MS } from "./constants";

let checkoutScript;
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (!checkoutScript) {
    checkoutScript = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const timeout = setTimeout(() => {
        script.remove();
        reject(new Error("Checkout loading timed out"));
      }, CHECKOUT_SCRIPT_TIMEOUT_MS);
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => { clearTimeout(timeout); resolve(); };
      script.onerror = () => { clearTimeout(timeout); script.remove(); reject(new Error("Checkout unavailable")); };
      document.body.appendChild(script);
    }).catch((error) => {
      checkoutScript = null;
      throw error;
    });
  }
  return checkoutScript;
}

function CustomerPaymentSession({ owner, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showOverlay, hideOverlay } = useOverlay();
  const { track } = useAnalytics();
  const { getItem, setItem, removeItem } = useLocalStorage();
  const [pending, setPending] = useState(() => readPending(getItem, owner));
  const [view, setView] = useState({ phase: pending ? PAYMENT_PHASE.CHECKING : PAYMENT_PHASE.IDLE });
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const dismissBookingSuccess = useCallback(() => setConfirmedBooking(null), []);
  const pendingRef = useRef(pending);
  const checkoutRef = useRef(null);
  const reconcileOnArrivalRef = useRef(null);
  const reviewCheckRef = useRef(null);
  const mounted = useRef(false);
  const locationRef = useRef(location);
  const bookingReturnToRef = useRef(location.state?.bookingReturnTo || null);
  const [supportContext, setSupportContext] = useState(() =>
    restoreSupportContext(location.state?.paymentSupport, owner, pending?.temp_trip_id),
  );
  const openBooking = useCallback((status) => {
    if (status.trip_status === TRIP_STATUS.CONFIRMED) {
      setConfirmedBooking(status);
      track(ANALYTICS_EVENTS.BOOKING_CONFIRMED, { booking_id: status.booking_id, trip_id: status.trip_id });
    }
    // Details load beneath the overlay so refreshing opens the confirmed trip.
    // Cancelled/completed trips open directly without success feedback.
    navigate(ROUTES.BOOKING_DETAIL.replace(":bookingId", encodeURIComponent(status.booking_id)), {
      replace: true,
      state: { fromBookingConfirmation: true, bookingReturnTo: bookingReturnToRef.current },
    });
  }, [navigate, track]);
  const clearPending = useCallback(() => {
    try {
      removeItem(pendingStorageKey(owner));
    } finally {
      pendingRef.current = null;
      setPending(null);
      setSupportContext(null);
      checkoutRef.current?.close();
      checkoutRef.current = null;
    }
  }, [removeItem, owner]);
  const [coordinator] = useState(() => new PaymentReconciliation({
    reconcile: reconcilePayment,
    getStatus: getPaymentStatus,
    onChange: setView,
    onBooked: (status) => {
      // Background recovery must not pull a customer away from a new booking/search/browsing activity unless they are on the confirmation page. The coordinator may still be running in the background, but the customer is not interrupted.
      if (locationRef.current.pathname !== ROUTES.PAYMENT_PENDING_CONFIRMATION) return;
      openBooking(status);
    },
    onReview: (status, reference) => {
      // Keep only identifiers for support/recovery, never provider payloads or messages.
      const identifiers = { temp_trip_id: reference,
        ...(typeof status.booking_id === "string" && status.booking_id ? { booking_id: status.booking_id } : {}) };
      setItem(pendingStorageKey(owner), identifiers);
      setPending(identifiers);
    },
    clearPending,
  }));

  useLayoutEffect(() => {
    locationRef.current = location;
    // Backend workers still recover the old trip while this reservation proceeds.
    if (location.pathname === ROUTES.BOOKING) coordinator.stop();
    reviewCheckRef.current?.abort();
  }, [location, coordinator]);

  useEffect(() => {
    mounted.current = true;
    if (pendingRef.current && locationRef.current.pathname !== ROUTES.BOOKING) {
      coordinator.start(pendingRef.current.temp_trip_id);
    }
    return () => {
      mounted.current = false;
      coordinator.stop();
      reviewCheckRef.current?.abort();
      checkoutRef.current?.close();
      hideOverlay();
    };
  }, [coordinator, hideOverlay]);

  useEffect(() => {
    if (location.pathname === ROUTES.PAYMENT_PENDING_CONFIRMATION && pendingRef.current) {
      // Wait for this route to commit (its first lazy load may suspend). Otherwise
      // a fast booked response can arrive while onBooked still sees /booking.
      const reference = pendingRef.current.temp_trip_id;
      const postFirst = reconcileOnArrivalRef.current === reference;
      reconcileOnArrivalRef.current = null;
      coordinator.start(reference, { postFirst });
    }
  }, [location.pathname, location.key, coordinator]);

  const checkAgain = useCallback(() => {
    if (pendingRef.current) coordinator.start(pendingRef.current.temp_trip_id);
  }, [coordinator]);

  const restoreCheckout = useCallback(async (orderData) => {
    const reference = orderData?.trip_id != null ? String(orderData.trip_id) : null;
    if (!reference || pendingRef.current?.temp_trip_id !== reference || checkoutRef.current ||
        locationRef.current.pathname !== ROUTES.BOOKING) return;
    reviewCheckRef.current?.abort();
    const controller = new AbortController();
    reviewCheckRef.current = controller;
    const routeKey = locationRef.current.key;
    const active = () => mounted.current && !controller.signal.aborted &&
      locationRef.current.key === routeKey && locationRef.current.pathname === ROUTES.BOOKING &&
      pendingRef.current?.temp_trip_id === reference && !checkoutRef.current;
    coordinator.stop();
    setView({ phase: PAYMENT_PHASE.CHECKING, reference });
    try {
      // One GET only: reviewing an interrupted checkout must not start polling or POST.
      const status = await getPaymentStatus(reference, controller.signal, {"check_payment_status": true});
      if (!active()) return;
      if (status?.temp_trip_id && status.temp_trip_id !== reference) throw new Error("Payment status reference does not match");
      if (status?.state === PAYMENT_STATE.BOOKED) {
        if (typeof status.booking_id !== "string" || !status.booking_id.trim() ||
            typeof status.trip_status !== "string" || !status.trip_status.trim()) {
          setView({ phase: PAYMENT_PHASE.REFERENCE, reference, status });
          return;
        }
        bookingReturnToRef.current = locationRef.current.state?.bookingReturnTo || null;
        setView({ phase: PAYMENT_PHASE.BOOKED, reference, status });
        openBooking(status);
        clearPending();
      } else if (status?.state === PAYMENT_STATE.REVIEW_REQUIRED) {
        setView({ phase: PAYMENT_PHASE.REVIEW, reference, status });
      } else {
        // "created" from initiate-booking is not a payment verdict. The customer may have closed checkout or navigated away before the backend could complete reconciliation.
        // Hence we allow retry payment only if server explicitly permits it. Otherwise the customer must start a new booking.
        setView({ phase: status?.can_retry_payment === true ? PAYMENT_PHASE.RETRY_READY : PAYMENT_PHASE.WAITING,
          reference, status });
      }
    } catch {
      if (active()) setView({ phase: PAYMENT_PHASE.WAITING, reference });
    } finally {
      if (reviewCheckRef.current === controller) reviewCheckRef.current = null;
    }
  }, [coordinator, openBooking, clearPending]);

  const onPay = async (orderData, overlayProps, checkoutContext = {}) => {
    if (!owner || !orderData?.trip_id) throw new Error("A customer and booking reference are required.");
    const existing = pendingRef.current || readPending(getItem, owner);
    const recoveryAction = checkoutRecoveryAction(existing, orderData?.trip_id, Boolean(checkoutRef.current),
      [PAYMENT_PHASE.DISMISSED, PAYMENT_PHASE.RETRY_READY].includes(view.phase) ? view.reference : null);
    if (recoveryAction === CHECKOUT_RECOVERY_ACTION.BUSY) return { paymentPendingConfirmation: true };
    if (recoveryAction === CHECKOUT_RECOVERY_ACTION.RECOVER) {
      pendingRef.current = existing;
      setPending(existing);
      if (!checkoutRef.current) {
        // Recover this saved checkout without reopening payment. The route effect
        // resumes status checks after the confirmation page commits.
        navigate(ROUTES.PAYMENT_PENDING_CONFIRMATION, {
          replace: true, state: {
            bookingReturnTo: bookingReturnToRef.current,
            paymentSupport: { owner, temp_trip_id: existing.temp_trip_id, supportContext },
          },
        });
      }
      return { paymentPendingConfirmation: true };
    }
    // A new order may replace the browser's recovery shortcut. Older trips remain
    // in backend reconciliation and can still appear in Upcoming Trips.
    coordinator.stop();
    reviewCheckRef.current?.abort();
    setConfirmedBooking(null);
    bookingReturnToRef.current = location.state?.bookingReturnTo || null;
    const reference = { temp_trip_id: String(orderData.trip_id) };
    // Persist before checkout. If storage fails, do not open a payment we cannot recover.
    if (!setItem(pendingStorageKey(owner), reference)) {
      throw new Error("We couldn't save your booking reference. Please enable browser storage before opening checkout.");
    }
    pendingRef.current = reference;
    setSupportContext(checkoutContext);
    setPending(reference);
    setView({ phase: PAYMENT_PHASE.CHECKOUT, reference: reference.temp_trip_id });
    track(ANALYTICS_EVENTS.PAYMENT_STARTED, {
      trip_id: reference.temp_trip_id, order_id: orderData.order_id,
      amount: orderData.amount, amount_in_lowest_unit: orderData.amount_in_lowest_unit,
      currency: orderData.currency, trip_type: checkoutContext.tripType,
    });
    checkoutRef.current = { close() {} }; // Synchronous lock while loading the script.
    let ended = false;
    const dismiss = () => {
      if (ended || !mounted.current || pendingRef.current?.temp_trip_id !== reference.temp_trip_id) return;
      ended = true;
      checkoutRef.current = null;
      reconcileOnArrivalRef.current = null;
      hideOverlay();
      // Closing checkout is not a payment verdict. Keep recovery saved, but allow
      // reopening this same order without navigating or starting reconciliation.
      setView({ phase: PAYMENT_PHASE.DISMISSED, reference: reference.temp_trip_id });
    };
    const finish = () => {
      if (ended || !mounted.current || pendingRef.current?.temp_trip_id !== reference.temp_trip_id) return;
      ended = true;
      checkoutRef.current = null;
      reconcileOnArrivalRef.current = reference.temp_trip_id;
      hideOverlay();
      navigate(ROUTES.PAYMENT_PENDING_CONFIRMATION, {
        replace: true, state: {
          bookingReturnTo: bookingReturnToRef.current,
          paymentSupport: { owner, temp_trip_id: reference.temp_trip_id, supportContext: checkoutContext },
        },
      });

    };
    showOverlay({ ...overlayProps, message: "Opening secure checkout...",
      subtext: "Please wait while we prepare your payment." });
    
      try {
      await loadCheckout();
      if (!mounted.current) return { paymentPendingConfirmation: true };
      hideOverlay();
      const checkout = new window.Razorpay({
        key: import.meta.env.VITE_RAZOR_PAY_KEY_ID,
        amount: orderData.amount_in_lowest_unit,
        currency: orderData.currency || DEFAULT_CURRENCY_CODE,
        name: `${APP.name} Trip Booking`,
        description: orderData.description || "Payment for your trip booking",
        order_id: orderData.order_id,
        prefill: {
          name: orderData.customer?.name || "",
          email: orderData.customer?.email || "",
          contact: orderData.customer?.contact || "",
        },
        handler: finish, // Backend reconciliation still determines booking success.
        modal: { ondismiss: dismiss },
      });
      checkoutRef.current = checkout;
      // payment.failed may leave Checkout open for another payment method.
      // Dismissal returns to review; the success handler starts confirmation.
      checkout.open();
    } catch {
      finish();
    }
    return { paymentPendingConfirmation: true };
  };

  const recoveryState = {
    bookingReturnTo: location.state?.bookingReturnTo,
    paymentSupport: pending && supportContext
      ? { owner, temp_trip_id: pending.temp_trip_id, supportContext }
      : null,
  };
  return (
    <PaymentContext.Provider value={{ pending, view, onPay, checkAgain, restoreCheckout, supportContext, recoveryState }}>
      <div inert={confirmedBooking ? true : undefined}>
        {children}
      </div>
       
      {confirmedBooking && (
        <SuccessOverlay
          visible
          showCountdown
          countdownLabel="Opening your booking in"
          message="Booking confirmed"
          duration={BOOKING_SUCCESS_DURATION_MS}
          onComplete={dismissBookingSuccess}
        >
          <p className="px-5 text-center text-sm text-white">You're all set. Your booking details are ready.</p>
          <p className="mt-3 max-w-sm break-all px-5 text-center font-mono text-xs text-white">
            Booking ID: {confirmedBooking.booking_id}
          </p>
          
        </SuccessOverlay>
      )}
    </PaymentContext.Provider>
  );
}

export function PaymentProvider({ children }) {
  const { customer } = useCustomer();
  const owner = String(customer?.customer_id || customer?.id || customer?.phone_number || "");
  return <CustomerPaymentSession key={owner} owner={owner}>{children}</CustomerPaymentSession>;
}
