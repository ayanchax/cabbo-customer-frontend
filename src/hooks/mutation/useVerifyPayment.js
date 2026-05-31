import { useMutation } from "@tanstack/react-query";
import { verifyPaymentForTrip } from "@/api";

export const useVerifyPaymentForTrip = (options = {}) => {
    return useMutation({
        mutationFn: verifyPaymentForTrip,
        ...options, // allows override (onSuccess, onError etc.)
    });
};