import { useQuery } from "@tanstack/react-query";
import { getBookingsFeedForCustomer } from "@/api";
import { TRIP_OCCURENCE_LABELS } from "@/utils";

const DEFAULT_FEED_CONFIG = {
    bucket: TRIP_OCCURENCE_LABELS.UPCOMING,
    page: 1,
    limit: 10,
};

export const useTripBookingsFeed = (options = {}) => {
    const feedConfig = {
        ...DEFAULT_FEED_CONFIG,
        ...(options.feedConfig || options),
    };

    return useQuery({
        queryKey: ["tripBookingsFeed", feedConfig],
        queryFn: () => getBookingsFeedForCustomer({ feedConfig }),
        retry: false, // don't retry on failure
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};
