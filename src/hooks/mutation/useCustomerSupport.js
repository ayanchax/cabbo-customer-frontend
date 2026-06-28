import { useMutation } from "@tanstack/react-query";
import { getSupportContactsForBooking } from "@/api";

export const useGetSupportContactsForBooking = (options = {}) => {
  return useMutation({
    mutationFn: getSupportContactsForBooking,
    ...options, // allows override (onSuccess, onError etc.)
  });
};