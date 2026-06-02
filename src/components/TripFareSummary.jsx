import React from "react";
import { Check, X, AlertTriangle, Info } from "lucide-react";
import {
  CollapsibleSection,
  TripFareBreakdown,
  RefundsAndCancellationPolicies,
  TripDisclaimer,
  TripIncExc,
} from "@/components";
import { formatCurrency, DEFAULT_CURRENCY_SYMBOL } from "@/utils";

// Unlike TripPaymentSummary (pre-payment, interactive), TripFareSummary is read-only —
// used on the booking detail page or post-payment confirmation to summarise what was paid.
function TripFareSummary({ fareData, className = "" }) {
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
  } = fareData || {};

  const currencySymbol = currency?.symbol || DEFAULT_CURRENCY_SYMBOL;

  const hasBreakdown =
    price_breakdown && Object.keys(price_breakdown).length > 0;
  const hasOverages =
    overages?.overage_amount_per_km || overages?.overage_amount_per_hour;

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
          {typeof balance_payment === "number" && balance_payment > 0 && (
            <div className="flex-1 flex flex-col items-center bg-gray-50 rounded-lg py-2 px-3">
              <span className="text-xs text-gray-500 mb-0.5">
                Pay to driver
              </span>
              <span className="text-base font-semibold text-gray-700 font-mono">
                {formatCurrency(balance_payment, currencySymbol)}
              </span>
            </div>
          )}
        </div>

        {/* Overage rates pill */}
        {hasOverages && (
          <div className="flex flex-wrap gap-2 pt-1">
            {overages.overage_amount_per_km && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                {formatCurrency(overages.overage_amount_per_km, currencySymbol)}
                /km overage
              </span>
            )}
            {overages.overage_amount_per_hour && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                {formatCurrency(
                  overages.overage_amount_per_hour,
                  currencySymbol,
                )}
                /hr overage
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Fare breakdown ──────────────────────────────────── */}
      {hasBreakdown && (
        <CollapsibleSection
          title="Fare Breakdown"
          titleClassName="text-gray-500 text-sm font-normal"
        >
          <TripFareBreakdown
            priceBreakdown={price_breakdown}
            currencySymbol={currencySymbol}
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
      {refunds_and_cancellation_policies &&
        refunds_and_cancellation_policies.length > 0 && (
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
      {disclaimers && disclaimers.length > 0 && (
        <div className="w-full mt-2">
          <TripDisclaimer disclaimers={disclaimers} />
        </div>
      )}
    </div>
  );
}

export { TripFareSummary };
