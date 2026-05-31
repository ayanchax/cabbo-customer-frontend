import React from "react";
import { useNavigate } from "react-router-dom";
import {
  RideTimings,
  RouteTimeline,
  PageHeader,
  TripDisclaimer,
  TripPaymentSummary,
  TripCabDetails,
  InCarAmenities,
} from "@/components";
import { useTimezone } from "@/hooks";
import { SelectedPackage } from "@/features/localHourlyRental/components";

function LocalHourlyRentalBooking({ orderData, bookingData, fleetData }) {
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
  if (!bookingData?.option) {
    throw new Error(
      "Missing required booking data: selected trip option is required.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }
  const selectedPackage = bookingData?.selectedPackage || null;

  const selectedFleet =
    fleetData?.find((fleet) => fleet?.name === bookingData?.option?.car_type) ||
    null;

  const fleet = {
    capacity: selectedFleet?.capacity || null,
    car_type: bookingData?.option?.car_type || null,
    fuel_type: bookingData?.option?.fuel_type || null,
    rate_per_min: bookingData?.option?.rate_per_min || null,
    currency: bookingData?.option?.currency || null,
    description: selectedFleet?.description || null,
    inventory_cab_names: selectedFleet?.inventory_cab_names || null,
  }

  const fareData ={
    total_price: bookingData?.option?.total_price || null,
    price_breakdown: bookingData?.option?.price_breakdown || null,
    overages: bookingData?.option?.overages || null,
    inclusions: bookingData?.metadata?.inclusions || null,
    exclusions: bookingData?.metadata?.exclusions || null,
    disclaimers: bookingData?.disclaimers || null,
    refunds_and_cancellation_policies: bookingData?.refunds_and_cancellation_policies || null,
  }

  const handlePay = () => {
    console.log("Pay button clicked. Implement payment flow here.");
  }
   

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
          onBack={() => navigate(-1)}
          title="Review and confirm your booking"
          className="px-0 mb-4"
          label="Hourly Rental"
        />
        <div className="px-4">
          <div className="py-2"></div>
         
          {/* Cab details */}
          <TripCabDetails
            cabDetails={fleet}
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
          {selectedPackage && (
            <SelectedPackage
              selectedPackage={selectedPackage}
              className=" mt-2 md:mb-4 mb-4"
            />
          )}

          {/* In-car amenities */}
          {bookingData?.metadata?.in_car_amenities && (
            <div className="mb-2">
              <InCarAmenities
                {...bookingData?.metadata?.in_car_amenities}
                className=""
                header="You will get these amenities in your cab:"
              />
            </div>
          )}

          {/* Payment summary and action */}
          {orderData && bookingData && (
            <div className="mt-6">
              <TripPaymentSummary orderData={orderData} fareData={fareData} onPay={handlePay}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { LocalHourlyRentalBooking };
