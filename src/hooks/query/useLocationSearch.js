import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { searchLocations } from "@/api";
import { useDebounce } from "@/hooks";

export const useLocationSearchQuery = (
  query,
  coordinates = {},
  sessionToken = null,
  delay = 300,
  min_length = 2,
) => {
  const debouncedQuery = useDebounce(query, delay);

  return useQuery({
    queryKey: ["locationSearch", debouncedQuery, coordinates],
    queryFn: ({ signal }) =>
      searchLocations(debouncedQuery, coordinates, signal, sessionToken),
    enabled: !!debouncedQuery && debouncedQuery.length >= min_length,

    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 10, // 10 min
    placeholderData: keepPreviousData, //Keeps previous results while fetching new ones for a better UX and to minimize loading states, especially when users are typing quickly through suggestions. This way we only show a loading state if there are no previous results to show, otherwise we keep showing the old results until the new ones arrive. This is particularly useful for location search where users might be typing fast and we want to avoid flickering/loading states as much as possible.
    retry: 1,
  });
};
