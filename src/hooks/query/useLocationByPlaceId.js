import { useQuery } from "@tanstack/react-query";
import { getLocationByPlaceId } from "@/api";

export const useLocationByPlaceIdQuery = (placeId, sessionToken=null) => {
  return useQuery({
    queryKey: ["locationByPlaceId", placeId, sessionToken],
    queryFn: () => getLocationByPlaceId(placeId, sessionToken),
    enabled: !!placeId, // Enable only if placeId is provided
    staleTime: Infinity, // never refetch automatically, for location by placeId we can assume that the result won't change for the same placeId and we want to minimize API calls
    cacheTime: Infinity, // keep forever
    refetchOnMount: false, // don't refetch on component remount, as the data is unlikely to change and we want to minimize API calls
  });
};