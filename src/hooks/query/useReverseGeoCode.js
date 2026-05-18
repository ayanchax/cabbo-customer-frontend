import { useQuery } from "@tanstack/react-query";
import { reverseGeocode } from "@/api";

export const useReverseGeocodingQuery = (lat, lng) => {
  return useQuery({
    queryKey: ["reverseGeocoding", lat, lng],
    queryFn: () => reverseGeocode(lat, lng),
    enabled: !!lat && !!lng, // Enable only if both lat and lng are provided
    staleTime: Infinity, // never refetch automatically, for reverse geocoding we can assume that the result won't change for the same coordinates and we want to minimize API calls
    gcTime: Infinity, // keep forever
    refetchOnMount: false, // don't refetch on component remount, as the data is unlikely to change and we want to minimize API calls
  });
};