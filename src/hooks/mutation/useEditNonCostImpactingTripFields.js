import { useMutation } from "@tanstack/react-query";
import { updateNonCostImpactingTripDetails } from "@/api";

export const useEditNonCostImpactingTripFields = (options = {}) => {
  return useMutation({
    mutationFn: ({ bookingId, payload }) =>
      updateNonCostImpactingTripDetails(bookingId, payload),
    ...options, // allows override (onSuccess, onError etc.)
  });
};
