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

export const getBookingDetails = async (booking_id) => {
    const { data } = await api.get(`${ENDPOINTS.TRIP.GET_BOOKING}/${booking_id}`);
    return data;
}

export const updateNonCostImpactingTripDetails = async (booking_id, payload) => {
    const { data } = await api.patch(`${ENDPOINTS.TRIP.UPDATE_NON_COST_IMPACTING_TRIP_DETAILS}/${booking_id}`, payload);
    return data;
}