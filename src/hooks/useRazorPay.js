import { useContext } from "react";
import { PaymentContext } from "@/payments";

export const useRazorPay = () => {
  const payment = useContext(PaymentContext);
  if (!payment) throw new Error("useRazorPay must be used within PaymentProvider");
  return { onPay: payment.onPay };
};
