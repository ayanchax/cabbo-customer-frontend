import { useMutation } from "@tanstack/react-query";
import { resendOtp } from "@/api";

export const useResendOtpMutation = (options = {}) => {
  return useMutation({
    mutationFn: resendOtp,
    ...options, // allows override (onSuccess, onError etc.)
  });
};