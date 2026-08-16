import { useMutation } from "@tanstack/react-query";
import { updateCustomerEmail } from "@/api";

export const useUpdateCustomerEmail = (options = {}) => {
  return useMutation({
    mutationFn: updateCustomerEmail,
    ...options,
  });
};
