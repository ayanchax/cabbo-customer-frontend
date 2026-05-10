import { useMutation } from "@tanstack/react-query";
import { initiateLogin } from "@/api";

export const useInitiateLoginMutation = (options = {}) => {
  return useMutation({
    mutationFn: initiateLogin,
    ...options, // allows override (onSuccess, onError etc.)
  });
};