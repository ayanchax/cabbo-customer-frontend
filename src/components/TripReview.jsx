import React, { useState } from "react";
import { CircleCheck, Send, Star } from "lucide-react";
import { useSubmitTripReview, useToast } from "@/hooks";
import {APP} from "@/utils"
import { ANALYTICS_EVENTS, useAnalytics } from "@/analytics";
const MAX_FEEDBACK_LENGTH = 500;
const RATING_OPTIONS = [1, 2, 3, 4, 5];

function normalizeReview(review) {
  if (!review || typeof review !== "object") return null;

  const rating = Number(review.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return null;

  return {
    rating,
    feedback: review.feedback || review.comment || review.review || "",
  };
}

function StarRating({ value, hoverValue, onChange, onHover, disabled = false }) {
  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Trip rating">
      {RATING_OPTIONS.map((rating) => {
        const isActive = (hoverValue || value) >= rating;

        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
            disabled={disabled}
            onClick={() => onChange(rating)}
            onMouseEnter={() => onHover(rating)}
            onMouseLeave={() => onHover(0)}
            className="rounded-md p-1 text-amber-400 transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Star
              className={`h-7 w-7 sm:h-8 sm:w-8 ${
                isActive ? "fill-current" : "fill-none text-gray-300"
              }`}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

function ReadOnlyReview({ review, justSubmitted = false }) {
  return (
    <section
      className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm"
      aria-label="Submitted Trip Review"
    >
      <div className="flex items-start gap-3">
        <div
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-emerald-100 ${
            justSubmitted ? "animate-review-success" : ""
          }`}
        >
          <CircleCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-gray-950">
            Thanks for rating your trip
          </h2>
          <div className="mt-2 flex items-center gap-1 text-amber-400">
            {RATING_OPTIONS.map((rating) => (
              <Star
                key={rating}
                className={`h-4 w-4 ${
                  review.rating >= rating ? "fill-current" : "fill-none text-gray-300"
                }`}
                aria-hidden="true"
              />
            ))}
            <span className="ml-1 text-xs font-semibold text-gray-600">
              {review.rating}/5
            </span>
          </div>
          {review.feedback && (
            <p className="mt-3 rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm leading-6 text-gray-700">
              {review.feedback}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function TripReview({ bookingId, initialReview = null, className = "" }) {
  const { showToast } = useToast();
  const { track } = useAnalytics();
  const [submittedReview, setSubmittedReview] = useState(() =>
    normalizeReview(initialReview),
  );
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);

  const submitReview = useSubmitTripReview();
  const isSubmitting = submitReview.isPending || submitReview.isLoading;
  const visibleReview = submittedReview || normalizeReview(initialReview);
  const charsLeft = MAX_FEEDBACK_LENGTH - feedback.length;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!bookingId) {
      showToast("We couldn't find this booking. Please refresh and try again.", "error");
      return;
    }

    if (!rating) {
      showToast("Please select a rating before submitting.", "error");
      return;
    }

    const trimmedFeedback = feedback.trim();
    const payload = {
      rating,
      ...(trimmedFeedback ? { feedback: trimmedFeedback } : {}),
    };

    try {
      const response = await submitReview.mutateAsync({ bookingId, payload });
      if (!response) {
        showToast("We couldn't submit your review. Please try again.", "error");
        return;
      }
      // At this point, the review submission is a success.
      track(ANALYTICS_EVENTS.REVIEW_SUBMITTED, {
        booking_id: bookingId,
        rating,
        has_feedback: Boolean(trimmedFeedback),
      });
      setSubmittedReview(payload);
      setJustSubmitted(true);
      setRating(0);
      setFeedback("");
      showToast("Thanks for your review.", "success");
    } catch (error) {
      track(ANALYTICS_EVENTS.REVIEW_FAILED, {
        booking_id: bookingId,
        rating,
        has_feedback: Boolean(trimmedFeedback),
        reason: error?.response?.data?.error_code || "unexpected_error",
      });
      showToast(
        error?.response?.data?.detail ||
          "We couldn't submit your review. Please try again.",
        "error",
      );
    }
  };

  if (visibleReview) {
    return (
      <div className={className}>
        <ReadOnlyReview review={visibleReview} justSubmitted={justSubmitted} />
      </div>
    );
  }

  return (
    <section
      className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${className}`}
      aria-label="Trip Review"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-950">
              Rate your trip
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Your feedback helps {APP.name} keep rides reliable.
            </p>
          </div>
          <StarRating
            value={rating}
            hoverValue={hoverRating}
            onChange={setRating}
            onHover={setHoverRating}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor={`trip-review-feedback-${bookingId}`}
            className="text-sm font-medium text-gray-700"
          >
            Add a note <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id={`trip-review-feedback-${bookingId}`}
            value={feedback}
            onChange={(event) =>
              setFeedback(event.target.value.slice(0, MAX_FEEDBACK_LENGTH))
            }
            disabled={isSubmitting}
            rows={3}
            maxLength={MAX_FEEDBACK_LENGTH}
            placeholder="Tell us what went well or what we can improve."
            className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70"
          />
          <div className="mt-1 text-left">
                <span
                  className={`text-xs ${
                    charsLeft < 20 ? "text-amber-700" : "text-gray-400"
                  }`}
                >
                  {charsLeft} characters left
                </span>
              </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!rating || isSubmitting}
            className="cursor-pointer inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? "Submitting..." : "Submit review"}
          </button>
        </div>
      </form>
    </section>
  );
}

export { TripReview };
