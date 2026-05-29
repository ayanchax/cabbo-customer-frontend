import React from "react";
import { useNavigate } from "react-router-dom";
import {
  InlineDateTimePicker,
  GettingRideOptionsIllustration,
  RideMetaDataPreferences,
  TripOptionsList,
  RideTimings,
  PersonBoardingCabIllustration,
  RouteTimeline,
  PageHeader,
  TripDisclaimer,
  TripPaymentSummary,
  TripCabDetails,
} from "@/components";
import { useTimezone } from "@/hooks";
import { SelectedPackage } from "@/features/localHourlyRental/components";

function LocalHourlyRentalBooking({ orderData, bookingData }) {
  const navigate = useNavigate();
  const { timezone: tz_info } = useTimezone();
  const origin = bookingData?.preferences?.origin || null;
  let dropOff = bookingData?.preferences?.destination || null;
  if (origin.place_id === dropOff?.place_id) {
    // If the origin and drop-off are the same, set dropOff to null to avoid confusion in the UI
    dropOff = null;
  }

  const startDate = { isoString: bookingData?.preferences?.start_date || null };
  if (!origin || !startDate.isoString) {
    throw new Error(
      "Missing required booking data: origin and start date are required.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }
  const selectedPackage = {
    included_hours: bookingData?.option?.included_hours || null,
    included_km: bookingData?.option?.included_kms || null,
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
        <PageHeader
          onBack={() => navigate(-1)}
          title="Review and confirm your booking"
          className="px-0 mb-4"
        />
        <div className="px-4">
          <div className="py-2"></div>

          <TripCabDetails
            cabDetails={bookingData?.option}
            
            className="mb-4  py-2 px-0"
          />

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
            timezone={tz_info?.timezone}
          />

          {/* Selected package */}
          {selectedPackage &&
            selectedPackage.included_hours &&
            selectedPackage.included_km && (
              <SelectedPackage
                selectedPackage={selectedPackage}
                className=" mt-2 md:mb-4"
              />
            )}

          {/* Payment summary and action */}
          {orderData && (
            <div className="mt-6">
              <TripPaymentSummary orderData={orderData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { LocalHourlyRentalBooking };
