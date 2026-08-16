import { useMutation } from "@tanstack/react-query";
import { classifyTripType } from "@/api";

export const useClassifyTripTypeMutation = (options = {}) => {
  return useMutation({
    mutationFn: classifyTripType,
    ...options, // allows override (onSuccess, onError etc.)
  });
};