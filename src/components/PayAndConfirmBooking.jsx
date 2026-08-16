import React from "react";
import { PAYMENT_ORDER_STATUS } from "@/utils";

function PayAndConfirmBooking({
  orderData = {},
  onPay = () => {},
  payAndConfirmBookingLabel = "Pay & Confirm Booking",
  className = "",
}) {
  const { status } = orderData;
  return (
    <button
      className={`w-full py-2  bg-primary text-white font-medium active:scale-[0.98] cursor-pointer hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      onClick={onPay}
      disabled={status !== PAYMENT_ORDER_STATUS.CREATED}
      aria-disabled={status !== PAYMENT_ORDER_STATUS.CREATED}
    >
      {status === PAYMENT_ORDER_STATUS.CREATED
        ? payAndConfirmBookingLabel
        : "Payment Complete"}
    </button>
  );
}

export { PayAndConfirmBooking };
