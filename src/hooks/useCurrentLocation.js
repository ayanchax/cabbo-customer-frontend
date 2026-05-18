/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useReverseGeocodingQuery, useLocalStorage, useRecentSuggestions } from "@/hooks";
import { LOCAL_STORAGE_KEYS } from "@/utils";

export const useCurrentLocation = (enabled = true) => {
  const { getItem, setItem } = useLocalStorage();
  const cachedLocation = getItem(LOCAL_STORAGE_KEYS.currentLocation);

  // Set initial coords from cache if available, so bias is present on first paint, which downstream will be used to do the location search in SearchCard - e.g, if a user types 'Park' and we have their location biased coordinates, we will show park names in user's current location using the Google Autocomplete API, this is also called proximity biasing parameter in Google Places API. 
  // This is particularly helpful for users in large cities with multiple locations with similar names, e.g, 'Park Street' in Kolkata vs 'Park Street' in Bangalore, with proximity biasing we will show the one in user's current city based on their coordinates. 
  // If we don't have cached location, coords will be null and we won't do any biasing for location search until we get the user's current location for the first time.
  const [location, setLocation] = useState(cachedLocation ?? null);
  const [loading, setLoading] = useState(!cachedLocation);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(
    cachedLocation && cachedLocation.lat && cachedLocation.lng
      ? { lat: cachedLocation.lat, lng: cachedLocation.lng }
      : null
  );
  const { cacheSuggestionToLocalStorage: cacheCurrentLocationAsRecentSuggestionItem } =
    useRecentSuggestions();

  const { data } = useReverseGeocodingQuery(
    coords?.lat,
    coords?.lng
  );

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords((prev) => {
          const baseline = prev ?? (cachedLocation
            ? { lat: cachedLocation.lat, lng: cachedLocation.lng }
            : null);

          // first time — no previous coords and no cache
          if (!baseline) {
            setLocation({
              display_name: "Current location",
              lat: latitude,
              lng: longitude,
              address: "Fetching exact address...",
            });

            return { lat: latitude, lng: longitude };
          }

          const latDiff = Math.abs(baseline.lat - latitude);
          const lngDiff = Math.abs(baseline.lng - longitude);

          // 🔥 threshold check (~10–15 meters)
          // if within threshold of cache, coords stays null → query stays disabled → no API call
          if (latDiff < 0.0001 && lngDiff < 0.0001) {
            return prev; // ignore tiny movement
          }

          // meaningful movement — trigger reverse geocoding
          setLocation({
            display_name: "Current location",
            lat: latitude,
            lng: longitude,
            address: "Fetching exact address...",
          });

          return { lat: latitude, lng: longitude };
        });
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    if (data) {
      setLocation(data);
      setItem(LOCAL_STORAGE_KEYS.currentLocation, data);
      // Cache the current location in recent suggestions as well, so it appears in the dropdown for easy access for first time, even if the user goes offline later. This also ensures consistency between the "current location" option and the recent suggestions list.
      cacheCurrentLocationAsRecentSuggestionItem(data);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, enabled]);

  return { location, coords, loading, error };
};