
import { useQueryClient } from "@tanstack/react-query";

const useRecentSuggestions = (queryKey=[]) => {

    const queryClient = useQueryClient();

    const recentSuggestions = (() => {
        const queries = queryClient
            .getQueryCache()
            .findAll({ queryKey });

        const recentQuery = queries
            .filter((query) => Array.isArray(query.state.data) && query.state.data.length > 0)
            .sort((a, b) => b.state.dataUpdatedAt - a.state.dataUpdatedAt)[0];

        return recentQuery?.state.data ?? [];
    })();

    return { recentSuggestions };
}

export { useRecentSuggestions }