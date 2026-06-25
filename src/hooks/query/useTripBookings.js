import { useQuery } from "@tanstack/react-query";
import { getAllBookingsForCustomer } from "@/api";

export const useTripBookings = () => {
    return useQuery({
        queryKey: ["tripBookings"],
        queryFn: () => getAllBookingsForCustomer(),
        retry: false, // don't retry on failure
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};