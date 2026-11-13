import { api } from "@/api";
import { ENDPOINTS, TRIP_OCCURENCE_LABELS } from "@/utils";


export const initiateTripBooking = (payload) => {
    return api.post(ENDPOINTS.TRIP.INITIATE_BOOKING, payload);
}

 
 

export const getBookingDetails = async (booking_id) => {
    const { data } = await api.get(`${ENDPOINTS.TRIP.GET_BOOKING}/${booking_id}`);
    return data;
}

export const updateNonCostImpactingTripDetails = async (booking_id, payload) => {
    const { data } = await api.patch(`${ENDPOINTS.TRIP.UPDATE_NON_COST_IMPACTING_TRIP_DETAILS}/${booking_id}`, payload);
    return data;
}

export const cancelTripBooking = async ({ bookingId, payload = {} }) => {
    const { data } = await api.patch(`${ENDPOINTS.TRIP.CANCEL_BOOKING}/${bookingId}/cancel`, payload);
    return data;
}

export const getAllBookingsForCustomer = async () => {
    const { data } = await api.get(ENDPOINTS.TRIP.MY_TRIPS);
    return data;
}

export const getBookingsFeedForCustomer = async ({ feedConfig = {
    bucket: TRIP_OCCURENCE_LABELS.UPCOMING,
    page: 1,
    limit: 10,
} }) => {
    const { data } = await api.get(ENDPOINTS.TRIP.MY_TRIPS_FEED, { params: feedConfig });
    return data;
}

export const getRefundDetailsForBooking = async (booking_id) => {
    const { data } = await api.get(`${ENDPOINTS.TRIP.REFUND_DETAILS}/${booking_id}`);
    return data;
}

export const getSupportContactsForBooking = async (payload) => {
    const { data } = await api.post(`${ENDPOINTS.TRIP.GET_SUPPORT_CONTACTS}`, payload);
    return data;
}

export const submitTripReview = async ({ bookingId, payload }) => {
    const { data } = await api.post(`${ENDPOINTS.TRIP.REVIEW_TRIP}/${bookingId}/submit-review`, payload);
    return data;
}   
