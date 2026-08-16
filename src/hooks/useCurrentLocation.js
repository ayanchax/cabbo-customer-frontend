/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useLocalStorage,
} from "./useLocalStorage";
import { useRecentSuggestions } from "./useRecentSuggestions";
import { useReverseGeocodingQuery } from "./query";
import { LOCAL_STORAGE_KEYS } from "@/utils";

const EARTH_RADIUS_METRES = 6371000;
const MIN_MOVEMENT_THRESHOLD_METRES = 25;
const MAX_MOVEMENT_THRESHOLD_METRES = 75;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const getDistanceInMetres = (from, to) => {
  const latitudeDelta = toRadians(to.lat - from.lat);
  const longitudeDelta = toRadians(to.lng - from.lng);
  const fromLatitude = toRadians(from.lat);
  const toLatitude = toRadians(to.lat);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  
  // Return the distance in metres using the haversine formula, which calculates the great-circle distance between two points on a sphere given their longitudes and latitudes. This is useful for determining how far a user has moved since their last known location, which can help decide whether to perform reverse geocoding again or use cached data.
  return (
    2 *
    EARTH_RADIUS_METRES *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
};

const getMovementThreshold = (previousAccuracy, currentAccuracy) => {
  const combinedAccuracy =
    (Number.isFinite(previousAccuracy) ? previousAccuracy : 0) +
    (Number.isFinite(currentAccuracy) ? currentAccuracy : 0);

  return Math.min(
    MAX_MOVEMENT_THRESHOLD_METRES,
    Math.max(MIN_MOVEMENT_THRESHOLD_METRES, combinedAccuracy),
  );
};

export const useCurrentLocation = (enabled = false) => {
  const { getItem, setItem } = useLocalStorage();
  const [cachedLocation] = useState(() =>
    getItem(LOCAL_STORAGE_KEYS.currentLocation),
  );
  const [cachedLocationFix] = useState(() =>
    getItem(LOCAL_STORAGE_KEYS.currentLocationFix),
  );
  const [location, setLocation] = useState(cachedLocation ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestCompleted, setRequestCompleted] = useState(false);
  const [shouldReverseGeocode, setShouldReverseGeocode] = useState(false);
  const [coords, setCoords] = useState(
    cachedLocationFix?.lat != null && cachedLocationFix?.lng != null
      ? { lat: cachedLocationFix.lat, lng: cachedLocationFix.lng }
      : cachedLocation?.lat != null && cachedLocation?.lng != null
        ? { lat: cachedLocation.lat, lng: cachedLocation.lng }
        : null,
  );
  const locationRef = useRef(cachedLocation); // Ref to store the last known location to avoid unnecessary re-renders and API calls if the location hasn't changed significantly
  const coordsRef = useRef(coords);
  const locationFixRef = useRef(cachedLocationFix); // Ref to store the last known location fix (with accuracy and timestamp) to determine if the user has moved significantly since the last known location, to avoid unnecessary reverse geocoding API calls
  const pendingLocationFixRef = useRef(null); // Ref to store the current location fix while waiting for reverse geocoding to complete, so we can update the location fix in local storage once we have the address details

  const {
    cacheSuggestionToLocalStorage: cacheCurrentLocationAsRecentSuggestion,
  } = useRecentSuggestions();

  const {
    data,
    isError: isReverseGeocodingError,
  } = useReverseGeocodingQuery(
    coords?.lat,
    coords?.lng,
    enabled && shouldReverseGeocode,
  );

  useEffect(() => {
    if (!enabled) return;

    setError(null);
    setRequestCompleted(false);
    setShouldReverseGeocode(false);
    setLoading(true);

    if (!navigator.geolocation) {
      setError("Current location is not supported by this browser.");
      setRequestCompleted(false);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: positionCoords, timestamp }) => {
        const latitude = positionCoords.latitude;
        const longitude = positionCoords.longitude;
        const currentFix = { // Current location fix with accuracy and timestamp for movement threshold calculations
          lat: latitude,
          lng: longitude,
          accuracy: positionCoords.accuracy,
          capturedAt: timestamp,
        };
        const baseline =
          locationFixRef.current ??
          coordsRef.current ??
          (cachedLocation
            ? { lat: cachedLocation.lat, lng: cachedLocation.lng }
            : null);

        if (baseline) {
          const distanceMoved = getDistanceInMetres(baseline, currentFix);
          const movementThreshold = getMovementThreshold(
            baseline.accuracy,
            currentFix.accuracy,
          );

          if (distanceMoved <= movementThreshold) {
            // If the user hasn't moved significantly since the last known location, we can use the cached location instead of reverse geocoding again. This helps reduce unnecessary API calls and improves performance.
            if (locationRef.current) {
              setLocation(locationRef.current);
            }
            locationFixRef.current = currentFix;
            setItem(LOCAL_STORAGE_KEYS.currentLocationFix, currentFix);
            coordsRef.current = currentFix;
            setCoords({ lat: latitude, lng: longitude });
            setRequestCompleted(true);
            setLoading(false);
            return;
          }
        }

        setLocation({
          display_name: "Current location",
          lat: latitude,
          lng: longitude,
          address: "Fetching exact address...",
        });
        pendingLocationFixRef.current = currentFix;
        coordsRef.current = { lat: latitude, lng: longitude };
        setCoords({ lat: latitude, lng: longitude });
        setShouldReverseGeocode(true);
      },
      (geolocationError) => {
        const errorMessages = {
          [geolocationError.PERMISSION_DENIED]:
            "Allow location access in your browser settings, then try again.",
          [geolocationError.POSITION_UNAVAILABLE]:
            "Your current location is unavailable right now. Please try again.",
          [geolocationError.TIMEOUT]:
            "Finding your location took too long. Please try again.",
        };
        const errorMessage =
          errorMessages[geolocationError.code] ??
          "We couldn't find your current location. Please try again.";

        setError(errorMessage);
        setRequestCompleted(false);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0, // maximum age of cached position to accept, in milliseconds. 0 means no caching, always get a fresh position.
      },
    );
  }, [cachedLocation, enabled, setItem]);

  useEffect(() => {
    if (!enabled || !shouldReverseGeocode || !data) return;

    setLocation(data);
    locationRef.current = data;
    setItem(LOCAL_STORAGE_KEYS.currentLocation, data);
    if (pendingLocationFixRef.current) {
      locationFixRef.current = pendingLocationFixRef.current;
      setItem(
        LOCAL_STORAGE_KEYS.currentLocationFix,
        pendingLocationFixRef.current,
      );
      pendingLocationFixRef.current = null;
    }
    cacheCurrentLocationAsRecentSuggestion(data);
    setShouldReverseGeocode(false);
    setRequestCompleted(true);
    setLoading(false);
  }, [
    cacheCurrentLocationAsRecentSuggestion,
    data,
    enabled,
    setItem,
    shouldReverseGeocode,
  ]);

  useEffect(() => {
    if (!enabled || !shouldReverseGeocode || !isReverseGeocodingError) return;

    setError(
      "We found your location, but couldn't get the address. Please try again.",
    );
    pendingLocationFixRef.current = null;
    setShouldReverseGeocode(false);
    setRequestCompleted(false);
    setLoading(false);
  }, [enabled, isReverseGeocodingError, shouldReverseGeocode]);

  const resetRequest = useCallback(() => {
    setError(null);
    setRequestCompleted(false);
  }, []);

  return {
    location,
    coords,
    loading,
    error,
    requestCompleted,
    resetRequest,
  };
};
