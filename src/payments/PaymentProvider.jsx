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
import { PAYMENT_PHASE, CHECKOUT_RECOVERY_ACTION, CHECKOUT_SCRIPT_TIMEOUT_MS, BOOKING_SUCCESS_DURATION_MS } from "./constants";

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
  const mounted = useRef(false);
  const locationRef = useRef(location);
  const bookingReturnToRef = useRef(location.state?.bookingReturnTo || null);
  const [supportContext, setSupportContext] = useState(() =>
    restoreSupportContext(location.state?.paymentSupport, owner, pending?.temp_trip_id),
  );
  const [coordinator] = useState(() => new PaymentReconciliation({
    reconcile: reconcilePayment,
    getStatus: getPaymentStatus,
    onChange: setView,
    onBooked: (status) => {
      // Background recovery must not pull a customer away from a new booking/search/browsing activity unless they are on the confirmation page. The coordinator may still be running in the background, but the customer is not interrupted.
      if (locationRef.current.pathname !== ROUTES.PAYMENT_PENDING_CONFIRMATION) return;
      if (status.trip_status === TRIP_STATUS.CONFIRMED) {
        setConfirmedBooking(status);
        track(ANALYTICS_EVENTS.BOOKING_CONFIRMED, { booking_id: status.booking_id, trip_id: status.trip_id });
      }
      // Open details immediately so refreshing during the success overlay
      // still loads this booking. The overlay only provides visual feedback.
      // Cancelled/completed trips open directly without the success overlay.
      navigate(ROUTES.BOOKING_DETAIL.replace(":bookingId", encodeURIComponent(status.booking_id)), {
        replace: true,
        state: { fromBookingConfirmation: true, bookingReturnTo: bookingReturnToRef.current },
      });
    },
    onReview: (status, reference) => {
      // Keep only identifiers for support/recovery, never provider payloads or messages.
      const identifiers = { temp_trip_id: reference,
        ...(typeof status.booking_id === "string" && status.booking_id ? { booking_id: status.booking_id } : {}) };
      setItem(pendingStorageKey(owner), identifiers);
      setPending(identifiers);
    },
    clearPending: () => {
      try {
        removeItem(pendingStorageKey(owner));
      } finally {
        pendingRef.current = null;
        setPending(null);
        setSupportContext(null);
        checkoutRef.current?.close();
        checkoutRef.current = null;
      }
    },
  }));

  useLayoutEffect(() => {
    locationRef.current = location;
    // Backend workers still recover the old trip while this reservation proceeds.
    if (location.pathname === ROUTES.BOOKING) coordinator.stop();
  }, [location, coordinator]);

  useEffect(() => {
    mounted.current = true;
    if (pendingRef.current && locationRef.current.pathname !== ROUTES.BOOKING) {
      coordinator.start(pendingRef.current.temp_trip_id);
    }
    return () => {
      mounted.current = false;
      coordinator.stop();
      checkoutRef.current?.close();
      hideOverlay();
    };
  }, [coordinator, hideOverlay]);

  useEffect(() => {
    if (location.pathname === ROUTES.PAYMENT_PENDING_CONFIRMATION && pendingRef.current) {
      coordinator.start(pendingRef.current.temp_trip_id);
    }
  }, [location.pathname, coordinator]);

  const checkAgain = useCallback(() => {
    if (pendingRef.current) coordinator.start(pendingRef.current.temp_trip_id);
  }, [coordinator]);

  const onPay = async (orderData, overlayProps, checkoutContext = {}) => {
    if (!owner || !orderData?.trip_id) throw new Error("A customer and booking reference are required.");
    const existing = pendingRef.current || readPending(getItem, owner);
    const recoveryAction = checkoutRecoveryAction(existing, orderData?.trip_id, Boolean(checkoutRef.current));
    if (recoveryAction === CHECKOUT_RECOVERY_ACTION.BUSY) return { paymentPendingConfirmation: true };
    if (recoveryAction === CHECKOUT_RECOVERY_ACTION.RECOVER) {
      pendingRef.current = existing;
      setPending(existing);
      if (!checkoutRef.current) {
        // If the checkout was interrupted, the customer may have closed the browser or navigated away, immediately returning to the confirmation page. The coordinator will resume recovery.
        coordinator.start(existing.temp_trip_id);
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
    const finish = () => {
      if (ended || !mounted.current || pendingRef.current?.temp_trip_id !== reference.temp_trip_id) return;
      ended = true;
      checkoutRef.current = null;
      coordinator.start(reference.temp_trip_id, { postFirst: true });
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
        handler: finish,
        modal: { ondismiss: finish },
      });
      checkoutRef.current = checkout;
      // payment.failed may leave Checkout open for another payment method.
      // Only handler/ondismiss finish checkout; neither determines booking success.
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
    <PaymentContext.Provider value={{ pending, view, onPay, checkAgain, supportContext, recoveryState }}>
      {children}
      {confirmedBooking && (
        <SuccessOverlay
          visible
          showCountdown
          countdownLabel="Opening your booking in"
          message="Booking confirmed"
          duration={BOOKING_SUCCESS_DURATION_MS}
          onComplete={dismissBookingSuccess}
        >
          <p className="px-5 text-center text-sm text-white/90">You're all set. Your booking details are ready.</p>
          <p className="mt-3 max-w-sm break-all px-5 text-center font-mono text-xs text-white/75">
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
