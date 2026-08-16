import { useMutation } from "@tanstack/react-query";
import { uploadProfilePicture } from "@/api";

export const useUploadCustomerProfilePicture = (options = {}) => {
  return useMutation({
    mutationFn: uploadProfilePicture,
    ...options,
  });
};
