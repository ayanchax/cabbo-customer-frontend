import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useLocale, useTimezone, useTripRefundDetail, useFragmentScroll } from "@/hooks";
import { humanReadableDateTime } from "@/components/common/datetime-picker/utils";
import {
  DEFAULT_CURRENCY_CODE,
  DEFAULT_USER_TIMEZONE,
  formatMoney,
  titleCase,
  REFUND_STATUS,
  APP,

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
  const { scrollToFragment } = useFragmentScroll();
  
  const { locale } = useLocale();
  const { timezone: clientTimezone } = useTimezone();
  const {
    data: refundResponse,
    isLoading,
    error,
  } = useTripRefundDetail(bookingId);

  const refundData = refundResponse || null;
  const currencyCode = currency?.code || DEFAULT_CURRENCY_CODE;
  const displayTimezone =
    timezone || clientTimezone?.timezone || DEFAULT_USER_TIMEZONE;

  if (isLoading) {
    return (
      <section
        className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${className}`}
        aria-label="Refund Summary"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
            <div className="mt-2 h-5 w-44 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="h-8 w-28 animate-pulse rounded-full bg-gray-100" />
        </div>
        <div className="mt-5 h-16 animate-pulse rounded-lg bg-gray-100" />
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
              This trip was cancelled. Refund information will appear here once {APP.name} has an update from the payment provider.
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
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary ring-1 ring-primary/10">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Refund Summary
          </p>
          <h2 className="mt-1 text-lg font-semibold text-gray-950">
            Cancelled trip refund
          </h2>
          </div>
        </div>

        
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusConfig.className}`}
        >
          <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {statusConfig.label}
        </span>
      </div>

      <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
        <p className="text-xs font-medium text-gray-500">Refund amount</p>
        <p className="mt-1 text-2xl font-semibold text-gray-950">
            {typeof refundData.refund_amount === "number"
              ? formatMoney(refundData.refund_amount, currencyCode)
              : "Not available"}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {refundData.refund_type && (
          <span className="inline-flex rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
            {titleCase(refundData.refund_type)} refund
          </span>
        )}
        {showRefundTimeline && initiatedDatetime && (
          <span className="inline-flex rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
            Initiated {initiatedDatetime}
          </span>
        )}
        {showRefundTimeline && retriedDatetime && (
          <span className="inline-flex rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
            Retried {retriedDatetime}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm leading-6 text-gray-600">
        {showRefundDescription && refundData.refund_description && (
          <p>{refundData.refund_description}</p>
        )}
        {showAutomaticUpdateNote && (
          <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 text-xs leading-5 text-gray-700">
            <Clock3
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>
              We will keep checking for updates and notify you once the refund
              is processed.{" "}
              <a
                href="#refunds-and-cancellations"
                onClick={(event) => scrollToFragment(event, "refunds-and-cancellations")}

                className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
              >
                View refund timeline
              </a>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

export { TripRefundSummary };
