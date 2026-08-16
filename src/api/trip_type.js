import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const classifyTripType = async (payload) => {
  const { data } = await api.post(ENDPOINTS.TRIP.CLASSIFY_TYPE, payload);
  return data;
};