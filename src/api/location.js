import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const reverseGeocode = async (lat, lng) => {
  const { data } = await api.get(`${ENDPOINTS.LOCATION.REVERSE_GEOCODE}?lat=${lat}&lng=${lng}`);
  return data;
};

export const searchLocations = async (query, coordinates = {}, signal=null) => {
  const { lat, lng } = coordinates;
  const { data } = await api.get(`${ENDPOINTS.LOCATION.SEARCH}?query=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}`, { signal });
  return data;
}