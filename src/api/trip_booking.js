import { api } from "@/api";
import { ENDPOINTS } from "@/utils";


export const initiateTripBooking = (payload) => {
  return api.post(ENDPOINTS.TRIP.INITIATE_BOOKING, payload);
}