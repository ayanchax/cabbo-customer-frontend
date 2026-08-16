import { useMutation } from "@tanstack/react-query";
import { updateCustomerName } from "@/api";

export const useUpdateCustomerName = (options = {}) => {
  return useMutation({
    mutationFn: updateCustomerName,
    ...options,
  });
};
