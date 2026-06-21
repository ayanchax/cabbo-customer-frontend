import { useQuery } from "@tanstack/react-query";
import { reverseGeocode } from "@/api";

export const useReverseGeocodingQuery = (lat, lng, enabled = true) => {
  return useQuery({
    queryKey: ["reverseGeocoding", lat, lng],
    queryFn: () => reverseGeocode(lat, lng),
    enabled: enabled && lat != null && lng != null,
    staleTime: Infinity, // never refetch automatically, for reverse geocoding we can assume that the result won't change for the same coordinates and we want to minimize API calls
    gcTime: Infinity, // keep forever
    refetchOnMount: false, // don't refetch on component remount, as the data is unlikely to change and we want to minimize API calls
  });
};
