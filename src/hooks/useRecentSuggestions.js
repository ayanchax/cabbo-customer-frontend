import { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/utils";
import { isDevMode } from "@/api";

const getSuggestionKey = (suggestion = {}) => {
  if (suggestion.place_id) return `place:${suggestion.place_id}`;

  const latitude = suggestion.lat ?? suggestion.latitude ?? "";
  const longitude = suggestion.lng ?? suggestion.longitude ?? "";

  if (latitude !== "" && longitude !== "") {
    return `coords:${latitude}:${longitude}`;
  }

  return `name:${suggestion.display_name || ""}:${suggestion.address || ""}`;
};

const useRecentSuggestions = (
  cacheKey = LOCAL_STORAGE_KEYS.recentSuggestions,
  limit = 5,
) => {
  const { getItem, setItem } = useLocalStorage();
  const [recentSuggestions, setRecentSuggestions] = useState(() => {
    const storedSuggestions = getItem(cacheKey);
    return Array.isArray(storedSuggestions)
      ? storedSuggestions.slice(0, limit)
      : [];
  });

  const cacheSuggestionToLocalStorage = useCallback(
    (suggestion = {}) => {
      try {
        if (
          !suggestion ||
          typeof suggestion !== "object" ||
          Object.keys(suggestion).length === 0
        ) {
          if (isDevMode) {
            console.warn("Empty suggestion provided, skipping recent history.");
          }
          return false;
        }

        const suggestionKey = getSuggestionKey(suggestion);
        const storedSuggestions = getItem(cacheKey);
        const currentSuggestions = Array.isArray(storedSuggestions)
          ? storedSuggestions
          : [];
        const nextSuggestions = [
          suggestion,
          ...currentSuggestions.filter(
            (item) => getSuggestionKey(item) !== suggestionKey,
          ),
        ].slice(0, limit);

        setItem(cacheKey, nextSuggestions);
        setRecentSuggestions(nextSuggestions);

        return true;
      } catch (error) {
        if (isDevMode) {
          console.error("Error caching recent suggestion:", error);
        }
        return false;
      }
    },
    [cacheKey, getItem, limit, setItem],
  );

  return { recentSuggestions, cacheSuggestionToLocalStorage };
};

export { useRecentSuggestions };
