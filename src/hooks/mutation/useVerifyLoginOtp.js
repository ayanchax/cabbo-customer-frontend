import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginWithOtp } from "@/api";

export const useVerifyLoginOtpMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginWithOtp,
    ...options, // allows override (onSuccess, onError etc.)
    onSuccess: (...args) => {
      queryClient.setQueryData(["isLoggedIn"], true);
      options.onSuccess?.(...args);
    },
  });
};
