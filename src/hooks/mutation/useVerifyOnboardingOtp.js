import { useMutation } from "@tanstack/react-query";
import { verifyOnboardingOtp } from "@/api";

export const useVerifyOnboardingOtpMutation = (options = {}) => {
  return useMutation({
    mutationFn: verifyOnboardingOtp,
    ...options, // allows override (onSuccess, onError etc.)
  });
};