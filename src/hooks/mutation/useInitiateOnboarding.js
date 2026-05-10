import { useMutation } from "@tanstack/react-query";
import { initiateOnboarding } from "@/api";

export const useInitiateOnboardingMutation = (options = {}) => {
  return useMutation({
    mutationFn: initiateOnboarding,
    ...options, // allows override (onSuccess, onError etc.)
  });
};