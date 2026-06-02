import React from "react";

//Unlike TripPaymentSummary which is used on the payment page after user selects a trip option and before they complete the payment, TripFareSummary is readonly and meant to be used on the trip details page after user has completed the payment, to show a detail/summary of the fare they paid along with any disclaimers or instructions related to their trip. It can also be used in the booking confirmation screen right after payment as part of a success message, to summarize the trip details and fare for the user. This component is more focused on summarizing the fare and related details after payment, while TripPaymentSummary is focused on providing fare breakdown and payment instructions before payment and lets user pay through it.
function TripFareSummary({ fareData }) {
  const {
    advance_payment, //number
    balance_payment, //number
    total_price, //number
    price_breakdown, // object with _ keys like base_fare, distance_fare, time_fare, taxes, etc. depending on how the backend structures it
    overages, // object {indicative_overage_warning:bool, overage_amount_per_hour:number, overage_amount_per_km:number}
    inclusions, // array of strings describing what's included in the fare
    exclusions, // array of strings describing what's not included in the fare
    disclaimers, // array of strings describing any disclaimers related to the fare or trip
    refunds_and_cancellation_policies, //array of strings describing the refund and cancellation policies related to this fare/trip
  } = fareData || {};
  return <div>TripFareSummary</div>;
}

export { TripFareSummary };
