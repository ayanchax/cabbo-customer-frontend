import React, { useEffect, useRef, useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast, useUpdateCustomerName } from "@/hooks";

function ProfileName({ name }) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(name || "");
  const inputRef = useRef(null);

  const updateName = useUpdateCustomerName();
  const isSaving = updateName.isPending || updateName.isLoading;
  const currentName = name || "Cabbo customer";
  const trimmedDraftName = draftName.trim();
  const hasChanged = trimmedDraftName && trimmedDraftName !== name;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setDraftName(name || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraftName(name || "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!trimmedDraftName) {
      showToast("Please enter your name.", "error");
      return;
    }

    if (!hasChanged) {
      setIsEditing(false);
      return;
    }

    try {
      await updateName.mutateAsync(trimmedDraftName);
      queryClient.setQueryData(["customerProfile"], (oldProfile) =>
        oldProfile ? { ...oldProfile, name: trimmedDraftName } : oldProfile,
      );
      setIsEditing(false);
      showToast("Name updated.", "success");
    } catch (error) {
      showToast(
        error?.response?.data?.detail ||
          "We couldn't update your name. Please try again.",
        "error",
      );
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSave();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    window.setTimeout(() => {
      if (!inputRef.current?.value.trim()) {
        handleCancel();
      }
    }, 0);
  };

  if (isEditing) {
    return (
      <div>
        <label htmlFor="customer-profile-name" className="sr-only">
          Name
        </label>
        <div className="flex max-w-full items-center rounded-lg border border-gray-200 bg-gray-50 pr-1 transition-within focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/15">
          <input
            ref={inputRef}
            id="customer-profile-name"
            type="text"
            value={draftName}
            disabled={isSaving}
            maxLength={60}
            onChange={(event) => setDraftName(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="min-w-0 flex-1 rounded-lg bg-transparent px-3 py-2 text-xl font-bold text-gray-950 outline-none disabled:cursor-not-allowed disabled:opacity-70 sm:text-2xl"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={!trimmedDraftName || isSaving}
            className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-primary transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:text-gray-300"
            aria-label={isSaving ? "Saving name" : "Save name"}
          >
            <Check className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cancel name edit"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {isSaving && (
          <p className="mt-1 text-xs text-gray-400">Saving name...</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-start gap-2">
      <h1 className="min-w-0 text-2xl font-bold text-gray-950 max-w-full overflow-hidden wrap-break-word leading-tight">
        {currentName}
      </h1>
      <button
        type="button"
        onClick={handleStartEdit}
        className="mt-0 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-primary/30 hover:bg-blue-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        aria-label="Edit name"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export { ProfileName };
