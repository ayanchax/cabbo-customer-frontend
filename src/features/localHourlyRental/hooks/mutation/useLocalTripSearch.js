import { useMutation } from "@tanstack/react-query";
import { searchTrips } from "@/api";

export const useLocalTripSearch = (options = {}) => {
  return useMutation({
    mutationFn: searchTrips,
    ...options, // allows override (onSuccess, onError etc.)
  });
};