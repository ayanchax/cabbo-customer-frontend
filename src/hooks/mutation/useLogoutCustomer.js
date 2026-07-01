import { useMutation } from "@tanstack/react-query";
import { logoutCustomer } from "@/api";

export const useLogoutCustomer = (options = {}) => {
  return useMutation({
    mutationFn: logoutCustomer,
    ...options,
  });
};
