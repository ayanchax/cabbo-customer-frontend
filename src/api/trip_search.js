import { api } from "@/api";
import { ENDPOINTS } from "@/utils";


export const searchTrips = (payload) => {
  return api.post(ENDPOINTS.TRIP.SEARCH, payload);
}