import React from "react";
import {
  RideTimings,
  RouteTimeline,
  BookingDetailPageHeader,
  TripFareSummary,
  TripCabDetails,
  InCarAmenities,
  DisputedBookingBlockedState,
  TripRefundSummary,
  TripSupportCard,
  TripDriverCard,
  TripSpecialRequest,
  CancelTripAction,
  TripReview,
} from "@/components";
import {TRIP_STATUS, TRIP_OCCURENCE_LABELS, TRIP_TYPES} from "@/utils";
import { useTimezone, useBookingDetailBackNavigation } from "@/hooks";
import { SelectedPackage } from "@/features/localHourlyRental/components";
import { Clock3 } from "lucide-react";
import { useLocation } from "react-router-dom";

import { DEFAULT_USER_TIMEZONE, ROUTES } from "@/utils";
function LocalHourlyRentalBookingDetail({ bookingDetail = {} }) {
  const { timezone: client_timezone } = useTimezone();
  const location = useLocation();
  const comingFromBookingPaymentPage =
    location?.state?.fromBookingConfirmation || false;
  const handleBack = useBookingDetailBackNavigation(
    comingFromBookingPaymentPage,
  );

  const {
    booking_id,
    fleet,
    origin,
    destination,
    start_datetime,
    timezone: server_timezone,
    status,
    label=undefined, // can be upcoming, completed, cancelled, past etc.
    tax_inclusive=false
  } = bookingDetail;
  let dropOff = destination || null;
  if (origin?.place_id === dropOff?.place_id) {
    // If the origin and drop-off are the same, set dropOff to null to avoid confusion in the UI
    dropOff = null;
  }

  const startDate = { isoString: start_datetime || null };
  if (!origin || !startDate.isoString) {
    throw new Error(
      "Missing required booking data: origin and start date are required.",
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
    rate_per_min: bookingDetail?.rate_per_min?.toFixed(2) || null,
    currency: bookingDetail?.currency || null,
    ...fleet,
  };

  const selectedPackage = bookingDetail?.package || null;
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
    trip_status: status || null,
    occurrence_label: label || null,
    tax_inclusive
  };
  const amenitiesLabel= status === TRIP_STATUS.CONFIRMED && label === TRIP_OCCURENCE_LABELS.UPCOMING ? 'You will get these amenities in your cab:' : 'Amenities that were provided for this trip:';
  const pickupLabel = status === TRIP_STATUS.CONFIRMED && label === TRIP_OCCURENCE_LABELS.UPCOMING ? 'Pickup at' : 'Pickup details';
  const hasAssignedDriver = Boolean(bookingDetail?.driver);
  const showCabAuxilliaryDetails =  [TRIP_STATUS.CONFIRMED].includes(status) && [TRIP_OCCURENCE_LABELS.UPCOMING].includes(label)
  const showInventory = showCabAuxilliaryDetails && !hasAssignedDriver;
  
  const isDisputedTrip = status === TRIP_STATUS.DISPUTED;
  const isCancelledTrip =
    status === TRIP_STATUS.CANCELLED ||
    label === TRIP_OCCURENCE_LABELS.CANCELLED;
  
  // Stale trip is a trip that is confirmed or created but has already passed and never made it to ongoing and to completed. In such cases, we don't show the driver section.
  const isStaleTrip = [TRIP_STATUS.CONFIRMED, TRIP_STATUS.CREATED].includes(status) && [TRIP_OCCURENCE_LABELS.PAST].includes(label);
  
  const showDriverSection =
    !isStaleTrip && (!isCancelledTrip || hasAssignedDriver);
  const isDriverContactWindow =
    [TRIP_STATUS.CONFIRMED, TRIP_STATUS.ONGOING].includes(status) &&
     [
       TRIP_OCCURENCE_LABELS.UPCOMING,
       TRIP_OCCURENCE_LABELS.ONGOING,
     ].includes(label);
  const showDriverContactAction =
    isDriverContactWindow && Boolean(bookingDetail?.driver?.phone);
  const showDriverContactActionHint =
    isDriverContactWindow && !showDriverContactAction;
  const showDriverCoordinationHint =
    showDriverContactAction && label === TRIP_OCCURENCE_LABELS.UPCOMING;
  const showSpecialRequest =
    !isCancelledTrip &&
    !isStaleTrip &&
    [TRIP_STATUS.CONFIRMED, TRIP_STATUS.CREATED].includes(status);
  const showCancellationAction =
    !isCancelledTrip &&
    !isStaleTrip &&
    [TRIP_STATUS.CONFIRMED, TRIP_STATUS.CREATED].includes(status) &&
    label === TRIP_OCCURENCE_LABELS.UPCOMING;
  const existingTripReview =
    bookingDetail?.rating || null
    
  const isFulfilledReviewEligible =
    !isCancelledTrip &&
    [TRIP_STATUS.COMPLETED, TRIP_STATUS.CLOSED].includes(status) &&
    Number(bookingDetail?.balance_payment ?? 0) === 0;
  const isCancelledDriverReviewEligible =
    isCancelledTrip && hasAssignedDriver;
  const showTripReview =
    !isStaleTrip &&
    (isFulfilledReviewEligible || isCancelledDriverReviewEligible);
  
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
        <BookingDetailPageHeader
          icon={Clock3}
          tripLabel="hourly rental"
          bookingId={booking_id}
          onBack={handleBack}
          occurenceLabel={label}
        />

        {isDisputedTrip ? (
          <div className="space-y-4 px-4">
            <DisputedBookingBlockedState className="mt-4" />
            <TripSupportCard
              bookingId={booking_id}
              origin={origin}
              tripType={TRIP_TYPES.LOCAL}
              tripLabel="hourly rental"
              reason="Disputed booking"
              defaultOpen
            />
          </div>
        ) : (
        <div className="px-4">
          <div className="py-2"></div>

          {/* Cab details */}
                    <TripCabDetails showDescription={showCabAuxilliaryDetails} showInventoryCabNames={showInventory} cabDetails={fleetData} className="mb-4  py-2 px-0" />
          
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
              server_timezone ??
              client_timezone?.timezone ??
              DEFAULT_USER_TIMEZONE
            }
            pickupLabel={pickupLabel}

          />

          {/* Selected package */}
          {selectedPackage && (
            <SelectedPackage
              selectedPackage={selectedPackage}
              className=" mt-2 md:mb-4 mb-4"
              showDescription={false}
            />
          )}

          {showDriverSection && (
            <TripDriverCard
              driver={bookingDetail?.driver}
              assignmentNotice={bookingDetail?.driver_assignment_notice}
              upgradationInformation={bookingDetail?.upgradation_information}
              preferredCabType={
                bookingDetail?.preferred_car_type || fleet?.car_type
              }
              preferredFuelType={
                bookingDetail?.preferred_fuel_type || fleet?.fuel_type
              }
              status={status}
              label={label}
              showContactAction={showDriverContactAction}
              showContactActionHint={showDriverContactActionHint}
              showDriverCoordinationHint={showDriverCoordinationHint}
              className="mb-4"
            />
          )}

          {showTripReview && (
            <TripReview
              bookingId={booking_id}
              initialReview={existingTripReview}
              className="mb-4"
            />
          )}
          {showSpecialRequest && (
            <TripSpecialRequest
              bookingId={booking_id}
              initialRequest={bookingDetail?.special_needs_requests}
              className="mb-4"
            />
          )}

          {/* In-car amenities */}
          {bookingDetail?.in_car_amenities && (
            <div className="mb-4">
              <InCarAmenities
                {...bookingDetail?.in_car_amenities}
                className=""
                header={amenitiesLabel}
              />
            </div>
          )}

         

          {isCancelledTrip && (
            <TripRefundSummary
              bookingId={booking_id}
              currency={bookingDetail?.currency}
              timezone={
                server_timezone ??
                client_timezone?.timezone ??
                DEFAULT_USER_TIMEZONE
              }
              className="mb-4 mt-4"
            />
          )}

          {isCancelledTrip && (
            <TripSupportCard
              bookingId={booking_id}
              origin={origin}
              tripType={TRIP_TYPES.LOCAL}
              tripLabel="hourly rental"
              reason="Cancelled trip refund help"
              className="mb-4"
            />
          )}

          

          {/* Fare summary */}
          {fareData && (
            <div className="mb-2">
              <TripFareSummary fareData={fareData} />
            </div>
          )}

          

           {!isCancelledTrip && (
            <TripSupportCard
              bookingId={booking_id}
              origin={origin}
              tripType={TRIP_TYPES.LOCAL}
              tripLabel="hourly rental"
              reason="Booking help"
              className="mb-4"
            />
          )}

          

          {showCancellationAction && (
            <CancelTripAction bookingId={booking_id} className="mb-4" />
          )}
        </div>
        )}
      </div>
    </div>
  );
}

export { LocalHourlyRentalBookingDetail };
