import { useQuery } from "@tanstack/react-query";
import { isLoggedIn } from "@/api";

export const useIsLoggedInQuery = () => {
  return useQuery({
    queryKey: ["isLoggedIn"],
    queryFn: isLoggedIn,
    retry: false, // don't retry auth check
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};