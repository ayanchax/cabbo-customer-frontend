import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const reverseGeocode = async (lat, lng) => {
  const { data } = await api.get(`${ENDPOINTS.LOCATION.REVERSE_GEOCODE}?lat=${lat}&lng=${lng}`);
  return data;
};