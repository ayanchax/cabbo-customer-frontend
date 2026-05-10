import { useQuery } from "@tanstack/react-query";
import { searchLocations } from "@/api";
import { useDebounce } from "@/hooks";

export const useLocationSearchQuery = (query, coordinates={}, sessionToken=null, delay = 300, min_length = 2) => {
    const debouncedQuery = useDebounce(query, delay);

    return useQuery({
        queryKey: ["locationSearch", debouncedQuery, coordinates],
        queryFn: ({ signal }) => searchLocations(debouncedQuery, coordinates, signal, sessionToken), // 🛠️ pass the signal for cancellation
        enabled: !!debouncedQuery && debouncedQuery.length >= min_length,

        staleTime: 1000 * 60 * 5, // 5 min
        cacheTime: 1000 * 60 * 10, // 10 min
        keepPreviousData: true, // 🔥 smooth UX
        retry: 1,
    });
};