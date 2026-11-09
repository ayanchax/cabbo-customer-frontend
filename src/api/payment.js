import { api } from "./client";
import { ENDPOINTS } from "@/utils";
import { PAYMENT_REQUEST_TIMEOUT_MS } from "@/payments/constants";

export async function reconcilePayment(tempTripId, signal) {
  const { data } = await api.post(
    `${ENDPOINTS.TRIP.GET_BOOKING}/payment/${encodeURIComponent(tempTripId)}/reconcile`,
    undefined,
    { signal, timeout: PAYMENT_REQUEST_TIMEOUT_MS },
  );
  return data;
}

export async function getPaymentStatus(tempTripId, signal, queryParams = {}) {
  const { data } = await api.get(
    `${ENDPOINTS.TRIP.GET_BOOKING}/payment/status/${encodeURIComponent(tempTripId)}`,
    { signal, timeout: PAYMENT_REQUEST_TIMEOUT_MS, params: queryParams },
  );
  return data;
}
