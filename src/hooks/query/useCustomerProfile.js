import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api";

export const useCustomerProfileQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["customerProfile"],
    queryFn: getProfile,
    enabled,// only fetch profile if enabled is true, which can be controlled by the caller (e.g. only fetch if user is logged in)
    staleTime: 1000 * 60 * 10, // 10 min
  });
};