import { useQuery } from "@tanstack/react-query";
import { verifyCustomerEmail } from "@/api";

export const useVerifyCustomerEmail = ({ ep, id, token, enabled = true }) => {
  return useQuery({
    queryKey: ["verifyCustomerEmail", ep, id, token],
    queryFn: () => verifyCustomerEmail({ ep, id, token }),
    enabled: enabled && !!id && !!token && !!ep, // only run the query if both id and token are provided
    retry: false, // don't retry on failure
    staleTime: 1000 * 60 * 2, // 2 min cache
  });
};
