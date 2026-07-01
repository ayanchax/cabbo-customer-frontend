import { useMutation } from "@tanstack/react-query";
import { reinitiateCustomerEmailVerification } from "@/api";

export const useReinitiateCustomerEmailVerification = (options = {}) => {
  return useMutation({
    mutationFn: reinitiateCustomerEmailVerification,
    ...options,
  });
};
