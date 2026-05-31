import { api } from "@/api";
import { ENDPOINTS } from "@/utils";


export const initiateTripBooking = (payload) => {
  return api.post(ENDPOINTS.TRIP.INITIATE_BOOKING, payload);
}

export const verifyPaymentForTrip = (payload) => {
    return api.post(ENDPOINTS.TRIP.VERIFY_PAYMENT_AND_CONFIRM_TRIP, payload);
}

export const cleanupStagedTrip = (trip_id) => {
    return api.delete(`${ENDPOINTS.TRIP.CLEANUP_STAGED_TRIP}/${trip_id}`);
}