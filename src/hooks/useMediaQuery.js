import { useCallback, useSyncExternalStore } from "react";

function getMediaQueryMatch(query, defaultValue) {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  return window.matchMedia(query).matches;
}

function useMediaQuery(query, defaultValue = false) {
  const subscribe = useCallback(
    (callback) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", callback);

      return () => {
        mediaQuery.removeEventListener("change", callback);
      };
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => getMediaQueryMatch(query, defaultValue),
    [defaultValue, query],
  );

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export { useMediaQuery };
