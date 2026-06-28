import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelTripBooking } from "@/api";

export const useCancelTripBooking = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelTripBooking,
    onSuccess: (_data, variables) => {
      if (variables?.bookingId) {
        queryClient.invalidateQueries({
          queryKey: ["tripBookingDetail", variables.bookingId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["tripBookingsFeed"] });
      options?.onSuccess?.(_data, variables);
    },
    ...options,
  });
};
