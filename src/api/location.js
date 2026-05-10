import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const reverseGeocode = async (lat, lng) => {
  const { data } = await api.get(`${ENDPOINTS.LOCATION.REVERSE_GEOCODE}?lat=${lat}&lng=${lng}`);
  return data;
};

export const searchLocations = async (query, coordinates = {}, signal=null, sessionToken=null) => {
  const { lat, lng } = coordinates;
  const { data } = await api.get(`${ENDPOINTS.LOCATION.SEARCH}?query=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}&session_token=${sessionToken}`, { signal });
  return data;
}

export const getLocationByPlaceId = async (placeId, sessionToken=null) => {
  const { data } = await api.get(`${ENDPOINTS.LOCATION.LOCATION_BY_PLACE_ID}?place_id=${placeId}&session_token=${sessionToken}`);
  return data;
}