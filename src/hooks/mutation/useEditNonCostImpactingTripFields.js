import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNonCostImpactingTripDetails } from "@/api";

export const useEditNonCostImpactingTripFields = (options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options;

  return useMutation({
    mutationFn: ({ bookingId, payload }) =>
      updateNonCostImpactingTripDetails(bookingId, payload),
    onSuccess: (data, variables, context) => {
      const bookingId = variables?.bookingId;
      const payload = variables?.payload || {};
      const responseBooking =
        data?.booking_detail || data?.booking || data?.data || data;
      const hasBookingLikeResponse =
        responseBooking &&
        typeof responseBooking === "object" &&
        (responseBooking.booking_id || responseBooking.trip_type);

      if (bookingId) {
        queryClient.setQueryData(
          ["tripBookingDetail", bookingId],
          (currentBooking) => {
            if (!currentBooking) return currentBooking;

            return {
              ...currentBooking,
              ...(hasBookingLikeResponse ? responseBooking : {}),
              ...payload,
            };
          },
        );
      }

      onSuccess?.(data, variables, context);
    },
    ...mutationOptions,
  });
};
