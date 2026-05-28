import { useMutation } from "@tanstack/react-query";
import { initiateTripBooking } from "@/api";

export const useInitiateTripBookingMutation = (options = {}) => {
    return useMutation({
        mutationFn: initiateTripBooking,
        ...options, // allows override (onSuccess, onError etc.)
    });
};