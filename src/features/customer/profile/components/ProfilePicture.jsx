import React, { useRef, useState } from "react";
import { Camera, LoaderCircle, UserRound } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks";
import { useUploadCustomerProfilePicture } from "../hooks/mutation";

const MAX_PROFILE_PICTURE_SIZE_BYTES = 2 * 1024 * 1024;

function getUploadedPictureUrl(response) {
  return (
    response?.data?.url || null
  );
}

function ProfilePicture({ pictureUrl, alt = "", initials = null }) {
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const uploadProfilePicture = useUploadCustomerProfilePicture();
  const hasProfilePicture = !!pictureUrl && !imageError;
  const isUploading =
    uploadProfilePicture.isPending || uploadProfilePicture.isLoading;

  const handleChooseFile = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (file.type !== "image/png") {
      showToast("Please choose a PNG image.", "error");
      return;
    }

    if (file.size > MAX_PROFILE_PICTURE_SIZE_BYTES) {
      showToast("Please choose a PNG under 2 MB.", "error");
      return;
    }

    try {
      const response = await uploadProfilePicture.mutateAsync(file);
      const uploadedPictureUrl = getUploadedPictureUrl(response);
      if (uploadedPictureUrl) {
        queryClient.setQueryData(["customerProfile"], (oldProfile) =>
          oldProfile
            ? {
                ...oldProfile,
                profile_picture_url: uploadedPictureUrl,
              }
            : oldProfile,
        );
        setImageError(false);
      } else {
        // If the response doesn't contain a valid URL, we can invalidate the query to refetch the profile data.
        queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
      }

      showToast("Profile picture updated.", "success");
    } catch (error) {
      showToast(
        error?.response?.data?.detail ||
          "We couldn't update your profile picture. Please try again.",
        "error",
      );
    }
  };

  return (
    <>
      {hasProfilePicture ? (
        <img
          src={pictureUrl}
          alt={alt || `${initials || "Customer"} profile picture`}
          className={`h-full w-full object-cover ${isUploading ? "opacity-60 pointer-events-none " : "pointer-events-auto"}`}
          onLoad={() => setImageError(false)}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`flex h-full w-full items-center justify-center text-xl font-bold ${isUploading ? 'opacity-50 pointer-events-none select-none' : 'pointer-events-auto'}`}>
          {initials || <UserRound className="h-8 w-8" aria-hidden="true" />}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={handleChooseFile}
        disabled={isUploading}
        className="absolute bottom-1 right-1 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/75 text-gray-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
        aria-label="Upload profile picture"
      >
        {isUploading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Camera className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </>
  );
}

export { ProfilePicture };
