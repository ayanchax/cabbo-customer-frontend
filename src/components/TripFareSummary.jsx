import React from "react";
import { AlertTriangle, Plus } from "lucide-react";
import {
  CollapsibleSection,
  TripFareBreakdown,
  RefundsAndCancellationPolicies,
  TripDisclaimer,
  TripIncExc,
  PayRestToDriver,
} from "@/components";
import {
  formatCurrency,
  DEFAULT_CURRENCY_SYMBOL,
  TRIP_OCCURENCE_LABELS,
  TRIP_STATUS,
} from "@/utils";

function getDriverPaymentDisplay({
  status,
  occurrenceLabel,
  balancePayment,
  totalPrice,
  advancePayment,
}) {
  const hasBalance =
    typeof balancePayment === "number" && balancePayment > 0;
  const expectedDriverAmount =
    typeof totalPrice === "number" && typeof advancePayment === "number"
      ? Math.max(totalPrice - advancePayment, 0)
      : null;
  const normalizedStatus = status?.toLowerCase();
  const normalizedOccurrenceLabel = occurrenceLabel?.toLowerCase();
  const isTerminalStatus = [
    TRIP_STATUS.COMPLETED,
    TRIP_STATUS.CLOSED,
  ].includes(normalizedStatus);
  const isPastOccurrence = [
    TRIP_OCCURENCE_LABELS.PAST,
    TRIP_OCCURENCE_LABELS.COMPLETED,
  ].includes(normalizedOccurrenceLabel);

  if (normalizedStatus === TRIP_STATUS.CANCELLED) return null;

  if (normalizedStatus === TRIP_STATUS.DISPUTED) {
    return {
      label: "Payment under review",
      amount: hasBalance ? balancePayment : expectedDriverAmount,
      toneClassName: "bg-amber-50 text-amber-700",
      note: "The driver payment for this trip is being reviewed.",
      showPaymentInstruction: false,
    };
  }

  if (isTerminalStatus && !hasBalance) {
    return {
      label: "Paid to driver",
      amount: expectedDriverAmount,
      toneClassName: "bg-green-50 text-green-700",
      note: null,
      showPaymentInstruction: false,
    };
  }

  if (isTerminalStatus || isPastOccurrence) {
    return {
      label: "Payment status pending",
      amount: hasBalance ? balancePayment : expectedDriverAmount,
      toneClassName: "bg-amber-50 text-amber-700",
      note:
        "This trip has ended, but its payment status has not been updated yet.",
      showPaymentInstruction: false,
    };
  }

  if (!hasBalance) return null;
  // This will be the case for trips that are still ongoing, or upcoming trips where the driver has not yet been paid.
  return {
    label: "Pay to driver",
    amount: balancePayment,
    toneClassName: "bg-gray-50 text-gray-700",
    note: null,
    showPaymentInstruction: true,
  };
}

// Unlike TripPaymentSummary (pre-payment, interactive), TripFareSummary is read-only —
// used on the booking detail page or post-payment confirmation to summarise what was paid.
function TripFareSummary({ fareData, className = "", showPayRestToDriver = true }) {
  const {
    advance_payment = null,
    balance_payment = null,
    total_price = null,
    price_breakdown = {},
    overages = {},
    inclusions = [],
    exclusions = [],
    disclaimers = [],
    refunds_and_cancellation_policies = [],
    currency = null,
    locked_add_on_keys = [],
    trip_status = null,
    occurrence_label = null,
  } = fareData || {};

  const currencySymbol = currency?.symbol || DEFAULT_CURRENCY_SYMBOL;

  const hasBreakdown =
     price_breakdown && Object.keys(price_breakdown).length > 0;
  const hasOverages =
    overages?.overage_amount_per_km || overages?.overage_amount_per_hour;
  const normalizedStatus = trip_status?.toLowerCase();
  const normalizedOccurrenceLabel = occurrence_label?.toLowerCase();
  const isCancelled =
    normalizedStatus === TRIP_STATUS.CANCELLED ||
    normalizedOccurrenceLabel === TRIP_OCCURENCE_LABELS.CANCELLED;
  const isCompleted =
    [TRIP_STATUS.COMPLETED, TRIP_STATUS.CLOSED].includes(normalizedStatus) ||
    normalizedOccurrenceLabel === TRIP_OCCURENCE_LABELS.COMPLETED;
  const isPast =
    normalizedOccurrenceLabel === TRIP_OCCURENCE_LABELS.PAST;
  
  const isDisputed = normalizedStatus === TRIP_STATUS.DISPUTED;
  const showOverages = Boolean(hasOverages) && !isCancelled;
  const showRefundPolicies =
  refunds_and_cancellation_policies?.length > 0 &&
  (isCancelled || isDisputed || (!isCompleted && !isPast));
  const showDisclaimers = disclaimers?.length > 0;
  const driverPaymentDisplay = getDriverPaymentDisplay({
    status: trip_status,
    occurrenceLabel: occurrence_label,
    balancePayment: balance_payment,
    totalPrice: total_price,
    advancePayment: advance_payment,
  });

  return (
    <div
      className={`flex flex-col gap-4 ${className}`}
      aria-label="Fare Summary"
    >
      {/* ── Fare totals ─────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
        {/* Total fare hero */}
        <div className="flex flex-col items-center pb-3 border-b border-gray-100">
          <span className="text-xs uppercase tracking-widest text-gray-400 mb-1">
            Total Fare
          </span>
          <span className="text-3xl font-bold text-gray-900 font-mono">
            {typeof total_price === "number"
              ? formatCurrency(total_price, currencySymbol)
              : "—"}
          </span>
        </div>

        {/* Paid / Pay-to-driver split */}
        <div className="flex gap-3">
          {typeof advance_payment === "number" && (
            <div className="flex-1 flex flex-col items-center bg-green-50 rounded-lg py-2 px-3">
              <span className="text-xs text-gray-500 mb-0.5">
                Paid in advance
              </span>
              <span className="text-base font-semibold text-green-700 font-mono">
                {formatCurrency(advance_payment, currencySymbol)}
              </span>
            </div>
          )}
          {driverPaymentDisplay &&
            typeof driverPaymentDisplay.amount === "number" &&
            driverPaymentDisplay.amount > 0 && (
            <div
              className={`flex-1 flex flex-col items-center rounded-lg py-2 px-3 ${driverPaymentDisplay.toneClassName}`}
            >
              <span className="text-xs text-gray-500 mb-0.5">
                {driverPaymentDisplay.label}
              </span>
              <span className="text-base font-semibold font-mono">
                {formatCurrency(driverPaymentDisplay.amount, currencySymbol)}
              </span>
            </div>
          )}
        </div>
        {showPayRestToDriver &&
          driverPaymentDisplay?.showPaymentInstruction && (
            <PayRestToDriver className="pt-1" />
          )}
        {driverPaymentDisplay?.note && (
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
            <AlertTriangle
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>{driverPaymentDisplay.note}</span>
          </div>
        )}


        {/* Overage rates pill */}
        {showOverages && (
          <div className="flex flex-wrap gap-2 pt-1">
            {overages.overage_amount_per_hour && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
                <Plus className="w-3 h-3 shrink-0" />
                {formatCurrency(
                  Math.ceil(overages.overage_amount_per_hour / 60),
                  currencySymbol,
                )}
                /extra min
              </span>
            )}
            {overages.overage_amount_per_km && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
                <Plus className="w-3 h-3 shrink-0" />
                {formatCurrency(overages.overage_amount_per_km, currencySymbol)}
                /extra km
              </span>
            )}
            
          </div>
        )}
      </div>

      {/* ── Fare breakdown ──────────────────────────────────── */}
      {hasBreakdown && (
        <CollapsibleSection
          title="Fare Breakdown"
          titleClassName="text-gray-500 text-sm md:text-base lg:text-md font-normal"
        >
          <TripFareBreakdown
            priceBreakdown={price_breakdown}
            currencySymbol={currencySymbol}
            lockedAddOnKeys={locked_add_on_keys}
            className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4"
          />
        </CollapsibleSection>
      )}

      {/* ── Inclusions & Exclusions ─────────────────────────── */}
      {(inclusions.length > 0 || exclusions.length > 0) && (
        <CollapsibleSection
          title="Inclusions & Exclusions"
          titleClassName="text-gray-500 text-sm md:text-base lg:text-md mb-1 font-normal"
        >
          <TripIncExc
            inclusions={inclusions}
            exclusions={exclusions}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 mb-1"
          />
        </CollapsibleSection>
      )}

      

      {/* ── Refunds & Cancellation ──────────────────────────── */}
      {/* Refunds and Cancellations - Collapsible */}
      {showRefundPolicies && (
          <CollapsibleSection
            title="Refunds and Cancellations"
            titleClassName="text-gray-500 text-sm md:text-base lg:text-md mb-1 font-normal"
          >
            <RefundsAndCancellationPolicies
              policies={refunds_and_cancellation_policies}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 mb-1"
            />
          </CollapsibleSection>
        )}

        {/* ── Disclaimers ─────────────────────────────────────── */}
      {showDisclaimers && (
        <div className="w-full mt-2">
          <TripDisclaimer disclaimers={disclaimers} />
        </div>
      )}
    </div>
  );
}

export { TripFareSummary };
