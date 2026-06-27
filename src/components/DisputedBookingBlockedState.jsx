import React from "react";
import { FeedbackState } from "@/components/common/FeedbackState";

function DisputedBookingBlockedState({ className = "" }) {
  return (
    <FeedbackState
      variant="warning"
      title="This booking is under review"
      message="Cabbo support is reviewing this trip offline. Payments, edits, refunds, and other self-service actions are paused until the review is complete."
      className={`min-h-[48vh] rounded-xl border border-amber-100 bg-amber-50/30 ${className}`}
    />
  );
}

export { DisputedBookingBlockedState };
