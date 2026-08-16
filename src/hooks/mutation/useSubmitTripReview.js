import { useMutation } from "@tanstack/react-query";
import { submitTripReview } from "@/api";
import { useQueryClient } from "@tanstack/react-query";


export const useSubmitTripReview = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ bookingId, payload }) =>
            submitTripReview({ bookingId, payload }),
        ...options,
        onSuccess: (data, variables, context) => {
            const review = data?.rating || variables?.payload || null;
            const bookingId = variables?.bookingId;

            if (bookingId && review) {
                queryClient.setQueryData(
                    ["tripBookingDetail", bookingId],
                    (current) => current ? { ...current, rating: review } : current,
                );
            }

            options.onSuccess?.(data, variables, context);
        },
    });
};
