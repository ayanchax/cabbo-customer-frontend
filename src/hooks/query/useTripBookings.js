import { useQuery } from "@tanstack/react-query";
import { getAllBookingsForCustomer } from "@/api";

// Unused for now, but we can use this hook to fetch all bookings for a customer in the future. Currently, we are fetching bookings in the TripDetails page directly using getAllBookingsForCustomer() and not using this hook. This hook is kept here for future use if needed.
export const useTripBookings = () => {
    return useQuery({
        queryKey: ["tripBookings"],
        queryFn: () => getAllBookingsForCustomer(),
        retry: false, // don't retry on failure
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};