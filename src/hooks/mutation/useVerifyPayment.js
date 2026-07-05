import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyPaymentForTrip } from "@/api";

export const useVerifyPaymentForTrip = (options = {}) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...mutationOptions } = options;

    return useMutation({
        mutationFn: verifyPaymentForTrip,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ["tripBookingsFeed"] });
            onSuccess?.(data, variables, context);
        },
        ...mutationOptions,
    });
};
