import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardAndLogin } from "@/api";

export const useOnboardingMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardAndLogin, // This should be the API function that handles both onboarding and login
    ...options, // allows override (onSuccess, onError etc.)
    onSuccess: (...args) => {
      queryClient.setQueryData(["isLoggedIn"], true);
      options.onSuccess?.(...args);
    },
  });
};
