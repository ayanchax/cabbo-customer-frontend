import { useQuery } from "@tanstack/react-query";
import { getCompany } from "@/api";

export const useCompanyQuery = (enabled=false) => {
  return useQuery({
    queryKey: ["company"],
    queryFn: () => getCompany(),
    enabled, // Enable or disable the query based on the provided flag
    staleTime: Infinity, // never refetch automatically, for company data we can assume that the result won't change frequently and we want to minimize API calls
    gcTime: Infinity, // keep forever
    refetchOnMount: false, // don't refetch on component remount, as the data is unlikely to change and we want to minimize API calls
  });
};