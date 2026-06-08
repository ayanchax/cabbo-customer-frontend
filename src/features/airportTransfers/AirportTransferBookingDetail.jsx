import React from "react";
import {
  RideTimings,
  RouteTimeline,
  PageHeader,
  TripFareSummary,
  TripCabDetails,
  InCarAmenities,
} from "@/components";
import { useTimezone } from "@/hooks";
import { isDevMode } from "@/api";

import { DEFAULT_USER_TIMEZONE } from "@/utils";
function AirportTransferBookingDetail({ bookingDetail = {} }) {
  const { timezone: client_timezone } = useTimezone();

  if (isDevMode) {
    console.log(
      "Booking Detail in AirportTransferBookingDetail:",
      bookingDetail,
    ); // Debug log to check the received booking detail data
  }
  const {
    booking_id,
    fleet,
    origin,
    destination,
    start_datetime,
    timezone: server_timezone,
  } = bookingDetail;
  const dropOff = destination || null;
  

  const startDate = { isoString: start_datetime || null };
  if (!origin || !dropOff || !startDate.isoString) {
    throw new Error(
      "Missing required booking data: origin, drop-off, and start date are required.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }

  if (!bookingDetail) {
    throw new Error(
      "Missing required booking data: booking details are required to display this page.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }

  const fleetData = {
    currency: bookingDetail?.currency || null,
    ...fleet,
  };

  const fareData = {
    advance_payment: bookingDetail?.advance_payment || null,
    balance_payment: bookingDetail?.balance_payment || null,
    total_price: bookingDetail?.final_price || null,
    price_breakdown: bookingDetail?.price_breakdown || null,
    overages: bookingDetail?.overages || null,
    inclusions: bookingDetail?.inclusions || null,
    exclusions: bookingDetail?.exclusions || null,
    disclaimers: bookingDetail?.overages?.disclaimer || null,
    refunds_and_cancellation_policies:
      bookingDetail?.refund_and_cancellation_policy || null,
    currency: bookingDetail?.currency || null,
  };
  return (
    <div
      className={` relative
          xl:w-3/4 min-h-screen overflow-y-auto
          bg-gray-50 sm:bg-white
          px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10
          py-2 xs:py-3 sm:py-6 md:py-8 lg:py-10
          mx-auto
          overflow-visible
          sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-screen-2xl
          sm:rounded-xl sm:shadow-lg
          shadow-[0_2px_16px_0_rgba(16,30,54,0.08)] max-w-full xl:mb-4
          
        `}
    >
      <div className="relative z-10">
        {/* Page header */}
        <PageHeader
          title={`Your booking - ${booking_id}`} // Display booking ID in the header, fallback to "N/A" if not available
          className="px-0 mb-4"
          label="Hourly Rental"
        />
        <div className="px-4">
          <div className="py-2"></div>

          {/* Cab details */}
          <TripCabDetails cabDetails={fleetData} className="mb-4  py-2 px-0" />

          {/* Route timeline */}
          <RouteTimeline
            pickupLocation={origin}
            dropoffLocation={dropOff}
            className="mb-4"
          />

          {/* Pick up date/time in readable format, like Friday, June 14, 2024, 3:00 PM */}
          <RideTimings
            startDatetime={startDate}
            className=" mt-4 mb-4"
            timezone={
              client_timezone?.timezone ??
              server_timezone ??
              DEFAULT_USER_TIMEZONE
            }
          />

          {/* In-car amenities */}
          {bookingDetail?.in_car_amenities && (
            <div className="mb-2">
              <InCarAmenities
                {...bookingDetail?.in_car_amenities}
                className=""
                header="You will get these amenities in your cab:"
              />
            </div>
          )}

          {/* Fare summary */}
          {fareData && (
            <div className="mb-2">
              <TripFareSummary fareData={fareData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { AirportTransferBookingDetail };
