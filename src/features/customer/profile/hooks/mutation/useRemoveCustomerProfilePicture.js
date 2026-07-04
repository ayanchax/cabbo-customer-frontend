import { useMutation } from "@tanstack/react-query";
import { removeProfilePicture } from "@/api";

//Unused
export const useRemoveCustomerProfilePicture = (options = {}) => {
  return useMutation({
    mutationFn: removeProfilePicture,
    ...options,
  });
};
