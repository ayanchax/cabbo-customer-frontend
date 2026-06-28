import React, { useState } from "react";
import { AlertTriangle, ChevronDown, X } from "lucide-react";
import { useCancelTripBooking, useToast } from "@/hooks";

const MAX_CANCELLATION_REASON_LENGTH = 250;

function CancelTripAction({ bookingId, className = "" }) {
  const { showToast } = useToast();
  const cancelTripApi = useCancelTripBooking();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const trimmedReason = reason.trim();
  const charsLeft = MAX_CANCELLATION_REASON_LENGTH - reason.length;
  const canCancel = Boolean(bookingId) && !cancelTripApi.isPending;

  const handleCancelTrip = async () => {
    if (!canCancel) return;

    const payload = {
      ...(trimmedReason ? { reason: trimmedReason } : {}),
      cancelation_detail: {
        cancellation_sub_status: "customer_cancelled",
        ...(trimmedReason ? { reason: trimmedReason } : {}),
      },
    };

    try {
      await cancelTripApi.mutateAsync({ bookingId, payload });
      showToast("Trip cancelled. Refund details will update shortly.", "success");
      setIsOpen(false);
    } catch {
      showToast(
        "We couldn't cancel this trip. Please try again or contact support.",
        "error",
      );
    }
  };

  return (
    <section
      className={`rounded-xl border border-red-100 bg-white p-4 shadow-sm ${className}`}
      aria-label="Cancel Trip"
    >
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left focus:outline-none focus:ring-2 focus:ring-red-100"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 ring-1 ring-red-100">
            <X className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-gray-950">
              Cancel this trip
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-gray-500">
              Cancellation policy and refund rules will apply.
            </span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="mt-4 border-t border-red-50 pt-4">
          <div className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-xs leading-5 text-amber-800">
            <AlertTriangle
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>
              Please cancel only if you no longer need this ride. Refund
              eligibility is calculated by Cabbo based on the cancellation
              policy for this booking.
            </span>
          </div>

          <label className="mt-3 block text-xs font-medium text-gray-500">
            Reason for cancellation <span className="font-normal">(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={MAX_CANCELLATION_REASON_LENGTH}
            rows={3}
            className="mt-1 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm leading-6 text-gray-800 outline-none transition focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
            placeholder="Tell us why you are cancelling, if you would like to."
          />

          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span
              className={`text-xs ${
                charsLeft < 20 ? "text-amber-700" : "text-gray-400"
              }`}
            >
              {charsLeft} characters left
            </span>
            <div className="flex gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Keep trip
              </button>
              <button
                type="button"
                onClick={handleCancelTrip}
                disabled={!canCancel}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-red-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelTripApi.isPending ? "Cancelling..." : "Confirm cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export { CancelTripAction };
