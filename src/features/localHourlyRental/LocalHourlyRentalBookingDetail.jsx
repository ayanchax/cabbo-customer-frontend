import React from "react";
import {
  RideTimings,
  RouteTimeline,
  PageHeader,
  TripDisclaimer,
  TripPaymentSummary,
  TripCabDetails,
  InCarAmenities,
  PaymentProcessingIllustration,
} from "@/components";
function LocalHourlyRentalBookingDetail({ bookingDetail = {} }) {
  console.log(
    "Booking Detail in LocalHourlyRentalBookingDetail:",
    bookingDetail,
  ); // Debug log to check the received booking detail data
  const { booking_id, fleet } = bookingDetail;
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
          <TripCabDetails cabDetails={fleet} className="mb-4  py-2 px-0" />
        </div>
      </div>
    </div>
  );
}

export { LocalHourlyRentalBookingDetail };
