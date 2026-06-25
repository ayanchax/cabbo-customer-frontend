import React, { useState } from "react";
import {
  RideTimings,
  RouteTimeline,
  BookingDetailPageHeader,
  TripFareSummary,
  TripCabDetails,
  InCarAmenities,
} from "@/components";
import {
  useTimezone,
  useBookingDetailBackNavigation,
  useEditNonCostImpactingTripFields,
  useToast,
} from "@/hooks";
import { isDevMode } from "@/api";
import { Plane } from "lucide-react";
import { useLocation } from "react-router-dom";

import { DEFAULT_USER_TIMEZONE, TRIP_TYPES, ROUTES, TRIP_STATUS, TRIP_OCCURENCE_LABELS } from "@/utils";
import { useAirportTransferServices } from "./hooks/useAirportTransferServices";
import { AirportPickupDetailsManager } from "./components/AirportPickupDetailsManager";
function AirportTransferBookingDetail({ bookingDetail = {} }) {
  const { timezone: client_timezone } = useTimezone();
  const { showToast } = useToast();

  const location = useLocation();
  const comingFromBookingPaymentPage =
    location?.state?.fromBookingConfirmation || false;
  const handleBack = useBookingDetailBackNavigation(
    comingFromBookingPaymentPage,
  );
  const editTripApi = useEditNonCostImpactingTripFields();
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
    trip_type = {
      description: "",
      display_name: "",
      trip_type: "",
    },
    price_breakdown,
    status,
    label=undefined // can be upcoming, completed, cancelled, past etc.
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

  const { lockedAddOnKeys, pageHeaderLabel } = useAirportTransferServices(
    { ...bookingDetail, trip_type: trip_type?.trip_type },
    price_breakdown,
  );
  console.log("Locked Add-on Keys for this booking:", lockedAddOnKeys); // Debug log to check locked add-on keys

  const fareData = {
    advance_payment: bookingDetail?.advance_payment || null,
    balance_payment: bookingDetail?.balance_payment || null,
    total_price: bookingDetail?.final_price || null,
    price_breakdown: price_breakdown,
    inclusions: bookingDetail?.inclusions || null,
    exclusions: bookingDetail?.exclusions || null,
    disclaimers: bookingDetail?.overages?.disclaimer || null,
    refunds_and_cancellation_policies:
      bookingDetail?.refund_and_cancellation_policy || null,
    currency: bookingDetail?.currency || null,
    locked_add_on_keys: lockedAddOnKeys,
    trip_status: status || null,
    occurrence_label: label || null,
  };

  const initialOperationalDetails = {
    flight_number: bookingDetail?.flight_number || null,
    terminal_number: bookingDetail?.terminal_number || null,
    placard_required: Boolean(bookingDetail?.placard_required),
    placard_name: bookingDetail?.placard_name || null,
  };

  const [operationalDetails, setOperationalDetails] = useState(
    initialOperationalDetails,
  );
  const [isEditingOperationalDetails, setIsEditingOperationalDetails] =
    useState(false);
  const [isSavingOperationalDetails, setIsSavingOperationalDetails] =
    useState(false);

  const handleEditOperationalDetails = () => {
    setIsEditingOperationalDetails(true);
  };

  const handleSaveOperationalDetails = async (details) => {
    setIsSavingOperationalDetails(true);
    try {
      if (isDevMode) {
        console.log(
          "Saving operational details for booking ID:",
          booking_id,
          details,
        );
      }
      const response = await editTripApi.mutateAsync({
        bookingId: booking_id,
        payload: details,
      });
      if (response && response?.message) {
        // The API returns the unwrapped response body after a successful update.
        setOperationalDetails(details);
        showToast("Arrival details updated.", "success");
      }
    } catch (error) {
      if (isDevMode) {
        console.error("Error saving operational details:", error);
      }
      showToast(
        "We couldn't update your arrival details. Please try again.",
        "error",
      );
    } finally {
      setIsSavingOperationalDetails(false);
      setIsEditingOperationalDetails(false);
    }
  };

  const handleCancelOperationalDetails = () => {
    setIsEditingOperationalDetails(false);
    setOperationalDetails(initialOperationalDetails);
  };

  const amenitiesLabel= status === TRIP_STATUS.CONFIRMED && label === TRIP_OCCURENCE_LABELS.UPCOMING ? 'You will get these amenities in your cab:' : 'Amenities that were provided for this trip:';
  const pickupLabel = status === TRIP_STATUS.CONFIRMED && label === TRIP_OCCURENCE_LABELS.UPCOMING ? 'Pickup' : 'Pickup details';
  const showCabAuxilliaryDetails =  [TRIP_STATUS.CONFIRMED].includes(status) && [TRIP_OCCURENCE_LABELS.UPCOMING].includes(label);
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
          icon={Plane}
          tripLabel={pageHeaderLabel || "airport transfer"}
          bookingId={booking_id}
          onBack={handleBack}
          occurenceLabel={label}
        />

        <div className="px-4">
          <div className="py-2"></div>

          {/* Cab details */}
          <TripCabDetails showDescription={showCabAuxilliaryDetails} showInventoryCabNames={showCabAuxilliaryDetails} cabDetails={fleetData} className="mb-4  py-2 px-0" />

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

          {trip_type?.trip_type === TRIP_TYPES.AIRPORT_PICKUP && (
            <AirportPickupDetailsManager
              read
              write={status === TRIP_STATUS.CONFIRMED && label === TRIP_OCCURENCE_LABELS.UPCOMING}
              helperTextLabel={
                status === TRIP_STATUS.CONFIRMED && label === TRIP_OCCURENCE_LABELS.UPCOMING
                  ? "Helps your driver coordinate your airport pickup."
                  : "These arrival details were provided for this airport pickup."
              }
              id="airportPickupDetails"
              value={operationalDetails}
              isEditing={isEditingOperationalDetails}
              isSaving={isSavingOperationalDetails}
              onChange={setOperationalDetails}
              onEdit={handleEditOperationalDetails}
              onSave={handleSaveOperationalDetails}
              onCancel={handleCancelOperationalDetails}
              className="mt-4 mb-4"
            />
          )}

          {/* In-car amenities */}
          {bookingDetail?.in_car_amenities && (
            <div className="mb-2">
              <InCarAmenities
                {...bookingDetail?.in_car_amenities}
                className=""
                header={amenitiesLabel}
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
