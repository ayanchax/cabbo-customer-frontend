import { useQuery } from "@tanstack/react-query";
import { getFleet } from "@/api";

export const useFleetQuery = (enabled=false) => {
  return useQuery({
    queryKey: ["fleet"],
    queryFn: () => getFleet(),
    enabled, // Enable or disable the query based on the provided flag
    staleTime: Infinity, // never refetch automatically, for fleet data we can assume that the result won't change frequently and we want to minimize API calls
    gcTime: Infinity, // keep forever
    refetchOnMount: false, // don't refetch on component remount, as the data is unlikely to change and we want to minimize API calls
  });
};