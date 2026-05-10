/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

export const useCustomerCoordinates = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    
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
        setCoords({ lat: newLat, lng: newLng });
        setLoading(false);

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
  }, []);



  return { coords, loading, error };
};