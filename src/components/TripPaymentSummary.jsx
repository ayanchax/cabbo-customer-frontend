import React from "react";
import {DEFAULT_CURRENCY_SYMBOL, PAYMENT_ORDER_STATUS} from "@/utils"
/**
 * Minimal, modern, and responsive payment summary and action component.
 * Accepts a trip order/booking response object and renders payment info and CTA.
 *
 * Props:
 *   orderData: The trip booking/order response object (required)
 *   onPay: Optional callback for payment action (default: noop)
 */
function TripPaymentSummary({ orderData, onPay = () => {} }) {
  if (!orderData) return null;

  const { amount, currency_symbol, messages, status } = orderData;

  // Find payment step/instruction if available
  const paymentStep = messages?.next_steps?.find(
    (step) => step.id === "COMPLETE_ADVANCE_PAYMENT"
  );

  // Sensible defaults if paymentStep is missing
  const instruction = paymentStep?.instruction || "Please complete the advance payment to confirm your booking.";
  const reason = paymentStep?.reason || "Advance payment helps us guarantee your trip booking and covers platform/convenience fees.";

  return (
    <section
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow p-4 flex flex-col items-center gap-3 border border-gray-100"
      aria-label="Trip Payment Summary"
    >
      
      <div className="text-3xl font-bold text-primary-600 flex items-baseline gap-1">
        {currency_symbol || DEFAULT_CURRENCY_SYMBOL}
        {amount}
      </div>
      <div className="text-sm text-gray-600 text-center">
        {instruction}
      </div>
      <div className="text-xs text-gray-500 text-center">
        {reason}
      </div>
      <button
        className="mt-2 w-full py-2 px-4 rounded bg-primary-600 text-white font-medium bg-primary active:scale-[0.98] cursor-pointer hover:bg-primary/90 transition"
        onClick={onPay}
        disabled={status !== PAYMENT_ORDER_STATUS.CREATED}
        aria-disabled={status !== PAYMENT_ORDER_STATUS.CREATED}
      >
        {status === PAYMENT_ORDER_STATUS.CREATED ? "Pay & Confirm Booking" : "Payment Complete"}
      </button>
    </section>
  );
}

export { TripPaymentSummary };
