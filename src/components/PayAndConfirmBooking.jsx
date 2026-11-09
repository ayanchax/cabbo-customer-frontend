import React, { useContext } from "react";
import { PAYMENT_ORDER_STATUS } from "@/utils";
import { PaymentContext, checkoutRecoveryAction, PAYMENT_PHASE, CHECKOUT_RECOVERY_ACTION } from "@/payments";
import { Link } from "react-router-dom";
import { ROUTES } from "@/utils";

function PayAndConfirmBooking({
  orderData = {},
  onPay = () => {},
  payAndConfirmBookingLabel = "Pay & Confirm Booking",
  className = "",
}) {
  const { status } = orderData;
  const payment = useContext(PaymentContext);
  const recoveryAction = checkoutRecoveryAction(payment?.pending, orderData.trip_id,
    payment?.view.phase === PAYMENT_PHASE.CHECKOUT,
    [PAYMENT_PHASE.DISMISSED, PAYMENT_PHASE.RETRY_READY].includes(payment?.view.phase) ? payment.view.reference : null);
  const unresolved = recoveryAction === CHECKOUT_RECOVERY_ACTION.RECOVER;
  const paymentBlocked = recoveryAction !== CHECKOUT_RECOVERY_ACTION.START;
  return (
    <div className="w-full max-w-xl">
    <button
      className={`w-full py-2  bg-primary text-white font-medium active:scale-[0.98] cursor-pointer hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      onClick={onPay}
      disabled={paymentBlocked || status !== PAYMENT_ORDER_STATUS.CREATED}
      aria-disabled={paymentBlocked || status !== PAYMENT_ORDER_STATUS.CREATED}
    >
      {paymentBlocked ? "Checking payment status" : status === PAYMENT_ORDER_STATUS.CREATED
        ? payAndConfirmBookingLabel
        : "Payment Complete"}
    </button>
    {unresolved && (
      <Link to={ROUTES.PAYMENT_PENDING_CONFIRMATION} state={payment.recoveryState}
        className="mt-3 block rounded text-center text-sm font-semibold text-primary underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-primary">
        Check booking status
      </Link>
    )}
    </div>
  );
}

export { PayAndConfirmBooking };
