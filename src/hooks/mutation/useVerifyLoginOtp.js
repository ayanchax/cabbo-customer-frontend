import { useMutation } from "@tanstack/react-query";
import { loginWithOtp } from "@/api";

export const useVerifyLoginOtpMutation = (options = {}) => {
  return useMutation({
    mutationFn: loginWithOtp,
    ...options, // allows override (onSuccess, onError etc.)
  });
};