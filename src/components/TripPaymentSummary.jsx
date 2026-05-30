import React from "react";
import { DEFAULT_CURRENCY_SYMBOL, PAYMENT_ORDER_STATUS} from "@/utils";
import {
  CollapsibleSection,
  TripDisclaimer,
  TripIncExc,
  TripPaymentInstructions,
  TripFareBreakdown,
  PayRestToDriver,
  TripFareDetail
} from "@/components";
import { Info } from "lucide-react";


function TripPaymentSummary({ orderData, fareData, onPay = () => {} }) {
  if (!orderData || !fareData) return null;

  const { amount, currency_symbol, messages, status } = orderData;
  const {
    overages = {},
    total_price = null,
    price_breakdown = {},
    inclusions = [],
    exclusions = [],
    disclaimers = [],
    
  } = fareData || {};

  const importantDisclaimers = overages?.disclaimer || disclaimers || [];

  // Payment instructions
  const paymentStep = messages?.next_steps?.find(
    (step) => step.id === "COMPLETE_ADVANCE_PAYMENT",
  );
  const instruction =
    paymentStep?.instruction ||
    "Please complete the advance payment to confirm your booking.";
  const reason =
    paymentStep?.reason ||
    "Advance payment helps us guarantee your booking and covers platform/convenience fees.";

  // Calculate pay-to-driver
  const payToDriver =
    typeof total_price === "number" && typeof amount === "number"
      ? Math.max(total_price - amount, 0) // Amount is the "advance to pay" by customer, so "pay to driver" is total price minus advance. It should never be negative, if it is we set it to 0.
      : null;

  return (
    <section
      className="w-full max-w-xl mx-auto  bg-white rounded-xl shadow p-4 flex flex-col gap-4 border border-gray-100"
      aria-label="Trip Payment Summary"
    >
      {/* Fares */}
      <TripFareDetail
        totalFare={total_price}
        payInAdvance={amount}
        payToDriver={payToDriver}
        currencySymbol={currency_symbol}
      />

      {/* Payment instructions */}
      <TripPaymentInstructions
        instruction={instruction}
        reason={reason}
        className="mt-2 pt-4 border-t border-gray-200"
      />

      {/* CTA */}
      <button
        className="mt-2 w-full py-2 px-4 rounded bg-primary text-white font-medium active:scale-[0.98] cursor-pointer hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={onPay}
        disabled={status !== PAYMENT_ORDER_STATUS.CREATED}
        aria-disabled={status !== PAYMENT_ORDER_STATUS.CREATED}
      >
        {status === PAYMENT_ORDER_STATUS.CREATED
          ? "Pay & Confirm Booking"
          : "Payment Complete"}
      </button>

      {/* Pay to driver note after CTA with enhancements */}
      {payToDriver > 0 && (
        <PayRestToDriver includeHorizontalRule/>
      )}

      {/* Fare breakdown - Collapsible */}
      {price_breakdown && Object.keys(price_breakdown).length > 0 && (
        <CollapsibleSection
          title="Fare Breakdown"
          titleClassName="text-gray-500 text-sm md:text-base lg:text-md mb-1 font-normal"

        >
          <TripFareBreakdown
            priceBreakdown={price_breakdown}
            currencySymbol={currency_symbol}
            className="mt-2"
          />
        </CollapsibleSection>
      )}

      {/* Inclusions & Exclusions - Collapsible */}
      {(inclusions.length > 0 || exclusions.length > 0) && (
        <CollapsibleSection
          title="Inclusions & Exclusions"
          titleClassName="text-gray-500 text-sm md:text-base lg:text-md mb-1 font-normal"
        >
          <TripIncExc
            inclusions={inclusions}
            exclusions={exclusions}
            className="bg-gray-50 p-3 rounded mb-1"
          />
        </CollapsibleSection>
      )}

      {/* Disclaimers (if any) */}
      {importantDisclaimers && importantDisclaimers.length > 0 && (
        <div className="w-full mt-2">
          <TripDisclaimer disclaimers={importantDisclaimers} />
        </div>
      )}
    </section>
  );
}

export { TripPaymentSummary };
