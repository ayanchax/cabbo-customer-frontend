import { useMutation } from "@tanstack/react-query";
import { submitTripReview } from "@/api";

export const useSubmitTripReview = (options = {}) => {
    return useMutation({
        mutationFn: ({ bookingId, payload }) =>
            submitTripReview({ bookingId, payload }),
        ...options,
    });
};
