
import { useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks";
import { LOCAL_STORAGE_KEYS } from "@/utils";
import { isDevMode } from "@/api";



// Generic hook to manage recent suggestions for any query key. It checks the react-query cache for the most recent data for the specified query key(s) and falls back to localStorage if no recent data is found. It also provides a function to cache new suggestions to localStorage, ensuring that even if the user goes offline or the API is unavailable, they can still see their recent searches.
const useRecentSuggestions = (queryKey = [], cacheKey = LOCAL_STORAGE_KEYS.recentSuggestions, limit=5) => {

    const queryClient = useQueryClient();
    const { getItem, setItem } = useLocalStorage();

    const recentSuggestions = (() => {
        const queries = queryClient
            .getQueryCache()
            .findAll({ queryKey });

        const recentQuery = queries
            .filter((query) => Array.isArray(query.state.data) && query.state.data.length > 0)
            .sort((a, b) => b.state.dataUpdatedAt - a.state.dataUpdatedAt)[0];

        const recentData =  recentQuery?.state.data ?? [];
        if (recentData.length === 0) {
            // If no recent data from queries, fallback to localStorage
            const localData = getItem(cacheKey) || [];
            return localData;
        }

        // Here show a mix of recent data from queries and localStorage, ensuring no duplicates (by place_id or full object match) and maintaining the order of recency. This way, if there are new suggestions from the API, they will be shown first, followed by older suggestions from localStorage that are not already included in the recent query data.
        const localData = getItem(cacheKey) || [];
        const combinedData = [...recentData];
        localData.forEach((item) => {
            if (!combinedData.some((d) => (d.place_id && item.place_id && d.place_id === item.place_id) || JSON.stringify(d) === JSON.stringify(item))) {
                combinedData.push(item);
            }
        });
        if (combinedData.length > limit) {
            return combinedData.slice(0, limit);
        }
        return combinedData;
    })();

    const cacheSuggestionToLocalStorage = (suggestion = {}) => {
        try {
            if (!suggestion || (typeof suggestion === "object" && Object.keys(suggestion).length === 0)) {
                console.warn("Empty suggestion object provided, skipping caching.");
                return false;
            }
            let recent = getItem(cacheKey) || [];
            // Remove if already present (by place_id or stringified object fallback)
            recent = recent.filter(
                (s) =>
                    // Filter uniqueness by place_id when available, otherwise by full object match. This handles both API suggestions (with place_id) and manually entered locations (without place_id).
                    (s.place_id && suggestion.place_id && s.place_id !== suggestion.place_id) ||
                    (!s.place_id && JSON.stringify(s) !== JSON.stringify(suggestion)),
            );
            // Add new item to front
            recent.unshift(suggestion);
            // Limit to specified number of items
            if (recent.length > limit) recent = recent.slice(0, limit);
            setItem(cacheKey, recent);
            return true;
        }
        catch (error) {
            if (isDevMode) {
                console.error("Error caching suggestion to localStorage:", error);
            }
            return false;
        }

    }

    return { recentSuggestions, cacheSuggestionToLocalStorage };
}

export { useRecentSuggestions }