import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquareText, Plus, X } from "lucide-react";
import { useEditNonCostImpactingTripFields, useToast } from "@/hooks";

const MAX_SPECIAL_REQUEST_LENGTH = 300;

function TripSpecialRequest({
  bookingId,
  initialRequest = "",
  className = "",
}) {
  const { showToast } = useToast();
  const editTripApi = useEditNonCostImpactingTripFields();
  const normalizedInitialRequest = String(initialRequest || "").trim();
  const [savedRequest, setSavedRequest] = useState(normalizedInitialRequest);
  const [requestText, setRequestText] = useState(normalizedInitialRequest);
  const [isAdding, setIsAdding] = useState(false);
  const requestEditorRef = useRef(null);
  const requestTextareaRef = useRef(null);
  const hasRequest = savedRequest.length > 0;
  const trimmedRequest = requestText.trim();
  const charsLeft = MAX_SPECIAL_REQUEST_LENGTH - requestText.length;

  const canSubmit = useMemo(
    () =>
      Boolean(bookingId) &&
      trimmedRequest.length > 3 && // Minimum 4 characters
      requestText.length <= MAX_SPECIAL_REQUEST_LENGTH &&
      !editTripApi.isPending,
    [bookingId, editTripApi.isPending, requestText.length, trimmedRequest.length],
  );

  const handleCancel = () => {
    setRequestText("");
    setIsAdding(false);
  };

  const handleStartAdding = () => {
    setIsAdding(true);
  };

  useEffect(() => {
    if (!isAdding) return;

    window.requestAnimationFrame(() => {
      requestEditorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      requestTextareaRef.current?.focus({ preventScroll: true });
    });
  }, [isAdding]);

  const handleSave = async () => {
    
    if (!canSubmit) return;

    try {
      await editTripApi.mutateAsync({
        bookingId,
        payload: {
          special_needs_requests: trimmedRequest,
        },
      });
      setSavedRequest(trimmedRequest);
      showToast("Special request added.", "success");
      setIsAdding(false);
    } catch {
      showToast(
        "We couldn't add your special request. Please try again.",
        "error",
      );
    }
  };

  if (hasRequest) {
    return (
      <section
        className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${className}`}
        aria-label="Special Request"
      >
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary ring-1 ring-primary/10">
            <MessageSquareText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-950">
              Special request
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-600">
              {savedRequest}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${className}`}
      aria-label="Special Request"
    >
      {!isAdding ? (
        <button
          type="button"
          onClick={handleStartAdding}
          className="flex w-full cursor-pointer items-center justify-between gap-3 text-left focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary ring-1 ring-primary/10">
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-gray-950">
                Add a special request
              </span>
              <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                Add once if your driver should know something before the trip.
              </span>
            </span>
          </span>
          <Plus className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        </button>
      ) : (
        <div ref={requestEditorRef}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-950">
                Special request
              </p>
              <p className="mt-0.5 text-xs leading-5 text-gray-500">
               You can add this once. We'll do our best to accommodate it where possible.
               </p>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Cancel special request"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <textarea
            ref={requestTextareaRef}
            value={requestText}
            onChange={(event) => setRequestText(event.target.value)}
            maxLength={MAX_SPECIAL_REQUEST_LENGTH}
            rows={3}
            className="mt-3 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm leading-6 text-gray-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            placeholder="Example: Please call before arriving, elderly passenger, fragile item, etc."
          />

          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span
              className={`text-xs ${
                charsLeft < 20 ? "text-amber-700" : "text-gray-400"
              }`}
            >
              {charsLeft} characters left
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSubmit}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editTripApi.isPending ? "Saving..." : "Save request"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export { TripSpecialRequest };
