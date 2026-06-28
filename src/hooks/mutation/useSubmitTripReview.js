import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitTripReview } from "@/api";

export const useSubmitTripReview = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ bookingId, payload }) =>
            submitTripReview({ bookingId, payload }),
        ...options, // allows override (onError etc.)
        onSuccess: (data, variables, context) => {
            if (variables?.bookingId) {
                queryClient.invalidateQueries({
                    queryKey: ["tripBookingDetail", variables.bookingId],
                });
            }
            queryClient.invalidateQueries({ queryKey: ["tripBookingsFeed"] });
            options?.onSuccess?.(data, variables, context);
        },
    });
};
