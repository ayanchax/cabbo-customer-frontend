import { useQuery } from "@tanstack/react-query";
import { getTripPriorBookingWindow } from "@/api";

export const useTripPriorBookingWindowQuery = (trip_type, jurisdiction_code) => {
    return useQuery({
        queryKey: ["tripPriorBookingWindow", trip_type, jurisdiction_code],
        queryFn: () => getTripPriorBookingWindow(trip_type, jurisdiction_code),
        enabled: !!trip_type && !!jurisdiction_code, // only run if both are provided
        retry: false, // don't retry on failure
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};