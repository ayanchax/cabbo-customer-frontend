import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  RotateCcw,
} from "lucide-react";
import { useLocale, useTimezone, useTripRefundDetail } from "@/hooks";
import { humanReadableDateTime } from "@/components/common/datetime-picker/utils";
import {
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_USER_TIMEZONE,
  formatCurrency,
  titleCase,
  REFUND_STATUS
} from "@/utils";

const REFUND_STATUS_CONFIG = {
  [REFUND_STATUS.COMPLETED]: {
    label: "Refund processed",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  [REFUND_STATUS.PROCESSED]: {
    label: "Refund processed",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  [REFUND_STATUS.SUCCESS]: {
    label: "Refund processed",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  [REFUND_STATUS.PENDING]: {
    label: "Refund in progress",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  [REFUND_STATUS.PROCESSING]: {
    label: "Refund in progress",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  [REFUND_STATUS.INITIATED]: {
    label: "Refund initiated",
    icon: Clock3,
    className: "bg-blue-50 text-primary ring-blue-100",
  },
  [REFUND_STATUS.FAILED]: {
    label: "Refund needs attention",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 ring-red-100",
  },
  [REFUND_STATUS.NOT_APPLICABLE]: {
    label: "No refund applicable",
    icon: RotateCcw,
    className: "bg-gray-50 text-gray-700 ring-gray-200",
  },
  [REFUND_STATUS.UNKNOWN]: {
    label: "Refund status unavailable",
    icon: RotateCcw,
    className: "bg-gray-50 text-gray-700 ring-gray-200",
  },
};

function getRefundStatusConfig(status) {
  return (
    REFUND_STATUS_CONFIG[String(status || REFUND_STATUS.UNKNOWN).toLowerCase()] ||
    REFUND_STATUS_CONFIG[REFUND_STATUS.UNKNOWN]
  );
}

function TripRefundSummary({
  bookingId,
  currency = null,
  timezone = DEFAULT_USER_TIMEZONE,
  className = "",
  showRefundDescription = false,
  showRefundTimeline = false,
}) {
  const { locale } = useLocale();
  const { timezone: clientTimezone } = useTimezone();
  const {
    data: refundResponse,
    isLoading,
    error,
  } = useTripRefundDetail(bookingId);

  const refundData = refundResponse || null;
  const currencySymbol = currency?.symbol || DEFAULT_CURRENCY_SYMBOL;
  const displayTimezone =
    timezone || clientTimezone?.timezone || DEFAULT_USER_TIMEZONE;

  if (isLoading) {
    return (
      <section
        className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${className}`}
        aria-label="Refund Summary"
      >
        <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
        <div className="mt-4 h-10 animate-pulse rounded-lg bg-gray-100" />
      </section>
    );
  }

  if (error || !refundData) {
    return (
      <section
        className={`rounded-xl border border-amber-100 bg-amber-50/40 p-4 shadow-sm ${className}`}
        aria-label="Refund Summary"
      >
        <div className="flex items-start gap-3">
          <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-100">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-950">
              Refund details are being updated
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This trip was cancelled. Refund information will appear here once
              Cabbo has an update from the payment provider.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const statusConfig = getRefundStatusConfig(refundData.refund_status);
  const StatusIcon = statusConfig.icon;
  const normalizedRefundStatus = String(
    refundData.refund_status || REFUND_STATUS.UNKNOWN,
  ).toLowerCase();
  const showAutomaticUpdateNote = [
    REFUND_STATUS.PENDING,
    REFUND_STATUS.PROCESSING,
    REFUND_STATUS.INITIATED,
    REFUND_STATUS.UNKNOWN,
  ].includes(normalizedRefundStatus);
  const initiatedDatetime = refundData.refund_initiated_datetime
    ? humanReadableDateTime(
        refundData.refund_initiated_datetime,
        locale,
        displayTimezone,
      )
    : null;
  const retriedDatetime = refundData.refund_retried_datetime
    ? humanReadableDateTime(
        refundData.refund_retried_datetime,
        locale,
        displayTimezone,
      )
    : null;

  return (
    <section
      className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${className}`}
      aria-label="Refund Summary"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Refund Summary
          </p>
          <h2 className="mt-1 text-lg font-semibold text-gray-950">
            Cancelled trip refund
          </h2>
        </div>
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusConfig.className}`}
        >
          <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {statusConfig.label}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Refund amount</p>
          <p className="mt-0.5 font-mono text-xl font-semibold text-gray-950">
            {typeof refundData.refund_amount === "number"
              ? formatCurrency(refundData.refund_amount, currencySymbol)
              : "Not available"}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Refund type</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-800">
            {titleCase(refundData.refund_type || "Not available")}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm leading-6 text-gray-600">
        {showRefundDescription && refundData.refund_description && (
          <p>{refundData.refund_description}</p>
        )}
        {showRefundTimeline && initiatedDatetime && <p>Initiated on {initiatedDatetime}</p>}
        {showRefundTimeline && retriedDatetime && <p>Last retried on {retriedDatetime}</p>}
        {showAutomaticUpdateNote && (
          <p>
            We will keep checking for updates and notify you once the refund is
            processed.
          </p>
        )}
      </div>
    </section>
  );
}

export { TripRefundSummary };
