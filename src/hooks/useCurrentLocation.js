/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useReverseGeocodingQuery } from "@/hooks";

export const useCurrentLocation = (enabled = true) => {
  const [location, setLocation] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        const newLat = Number(latitude.toFixed(2));
        const newLng = Number(longitude.toFixed(2));

        setCoords((prev) => {
          // first time
          if (!prev) {
            setLocation({
              display_name: "Current location",
              lat: newLat,
              lng: newLng,
              address: "Fetching exact address...",
            });

            return { lat: newLat, lng: newLng };
          }

          const latDiff = Math.abs(prev.lat - newLat);
          const lngDiff = Math.abs(prev.lng - newLng);

          // 🔥 threshold check (~10–15 meters)
          if (latDiff < 0.0001 && lngDiff < 0.0001) {
            return prev; // ignore tiny movement
          }

          // update only if meaningful movement
          setLocation({
            display_name: "Current location",
            lat: newLat,
            lng: newLng,
            address: "Fetching exact address...",
          });

          return { lat: newLat, lng: newLng };
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
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    if (data) {
      setLocation(data);
      setLoading(false);
    }
  }, [data, enabled]);

  return { location, loading, error };
};