import { useQuery } from "@tanstack/react-query";
import { getRefundDetailsForBooking } from "@/api";

export const useTripRefundDetail = (booking_id) => {
    return useQuery({
        queryKey: ["tripRefundDetail", booking_id],
        queryFn: () => getRefundDetailsForBooking(booking_id),
        enabled: !!booking_id, // only run if booking_id is provided
        retry: false, // don't retry on failure
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};