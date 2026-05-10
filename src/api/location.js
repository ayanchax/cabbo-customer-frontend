import { api } from "@/api";
import { ENDPOINTS } from "@/utils";


// Reverse geocoding: get address details from coordinates
// Does not use sessionToken as it's not user-specific and we want to maximize cache hits across users for popular locations (e.g. city centers)
export const reverseGeocode = async (lat, lng) => {
  const { data } = await api.get(`${ENDPOINTS.LOCATION.REVERSE_GEOCODE}?lat=${lat}&lng=${lng}`);
  return data;
};

// Location search: get location suggestions based on query and optionally coordinates (for relevance sorting)
// Uses sessionToken for better results and to enable features like location enrichment in the future, but it's optional to allow caching across users for popular queries
export const searchLocations = async (query, coordinates = {}, signal=null, sessionToken=null) => {
  const { lat, lng } = coordinates;
  const { data } = await api.get(`${ENDPOINTS.LOCATION.SEARCH}?query=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}&session_token=${sessionToken}`, { signal });
  return data;
}

// Get location details by place ID
// Uses sessionToken for better results and to enable features like location enrichment in the future
export const getLocationByPlaceId = async (placeId, sessionToken=null) => {
  const { data } = await api.get(`${ENDPOINTS.LOCATION.LOCATION_BY_PLACE_ID}?place_id=${placeId}&session_token=${sessionToken}`);
  return data;
}