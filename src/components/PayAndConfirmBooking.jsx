import React from "react";
import { PAYMENT_ORDER_STATUS } from "@/utils";

function PayAndConfirmBooking({ orderData = {}, onPay = () => {} }) {
  const { status } = orderData;
  return (
      <button
        className="w-full max-w-xl py-2 px-4 rounded bg-primary text-white font-medium active:scale-[0.98] cursor-pointer hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
        onClick={onPay}
        disabled={status !== PAYMENT_ORDER_STATUS.CREATED}
        aria-disabled={status !== PAYMENT_ORDER_STATUS.CREATED}
      >
        {status === PAYMENT_ORDER_STATUS.CREATED
          ? "Pay & Confirm Booking"
          : "Payment Complete"}
      </button>
  );
}

export { PayAndConfirmBooking };
