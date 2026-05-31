import React, { useRef } from "react";
import { DEFAULT_CURRENCY_SYMBOL } from "@/utils";
import {
  CollapsibleSection,
  TripDisclaimer,
  TripIncExc,
  TripPaymentInstructions,
  TripFareBreakdown,
  PayRestToDriver,
  TripFareDetail,
  RefundsAndCancellationPolicies,
  PayAndConfirmBooking,
} from "@/components";
import { useSticky } from "@/hooks";
import { Info } from "lucide-react";

function TripPaymentSummary({ orderData, fareData, onPay = () => {} }) {
  const payBtnRef = useRef(null);
  const isSticky = useSticky(payBtnRef);

  if (!orderData || !fareData) return null;

  // eslint-disable-next-line no-unused-vars
  const { amount, currency_symbol, messages, status } = orderData;
  const {
    overages = {},
    total_price = null,
    price_breakdown = {},
    inclusions = [],
    exclusions = [],
    disclaimers = [],
    refunds_and_cancellation_policies = [],
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
    <div className="relative">
      <section
        className="w-full max-w-xl mx-auto  bg-white rounded-xl shadow p-4 flex flex-col gap-4 border border-gray-100 lg:mb-4 mb-10"
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

        {/* CTA - Pay button immediately after payment instructions */}
        <div ref={payBtnRef}>
          <PayAndConfirmBooking
            orderData={orderData}
            onPay={onPay}
            className="px-4 rounded shadow-md"
          />
        </div>

        {/* Pay to driver note after CTA with enhancements */}
        {payToDriver > 0 && <PayRestToDriver includeHorizontalRule />}

        {/* Fare breakdown - Collapsible */}
        {price_breakdown && Object.keys(price_breakdown).length > 0 && (
          <CollapsibleSection
            title="Fare Breakdown"
            titleClassName="text-gray-500 text-sm md:text-base lg:text-md mb-1 font-normal"
          >
            <TripFareBreakdown
              priceBreakdown={price_breakdown}
              currencySymbol={currency_symbol}
              className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 mb-1"
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
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 mb-1"
            />
          </CollapsibleSection>
        )}

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

        {/* Disclaimers (if any) */}
        {importantDisclaimers && importantDisclaimers.length > 0 && (
          <div className="w-full mt-2">
            <TripDisclaimer disclaimers={importantDisclaimers} />
          </div>
        )}
        {/* Sticky Pay button at bottom when original is out of view */}
      </section>
      {isSticky && (
        <div className="fixed bottom-0 left-0 w-full z-30 flex justify-center bg-white/90 backdrop-blur-sm md:py-2 md:px-4 border-t border-gray-200 ">
          <PayAndConfirmBooking orderData={orderData} onPay={onPay} className="w-full max-w-xl" payAndConfirmBookingLabel={`Pay (${currency_symbol}${amount}) & Confirm Booking`} />
        </div>
      )}
    </div>
  );
}

export { TripPaymentSummary };
