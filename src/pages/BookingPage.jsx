import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInitiateTripBookingMutation } from "@/hooks";
import { FeedbackState, Loader } from "@/components";
import {
  TRIP_TYPES,
  CAB_TYPES,
  CAB_FUEL_TYPES,
  SERVER_ERROR_CODES,
  ROUTES,
} from "@/utils";

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingPayload = location.state?.bookingPayload;

  const [bookingError, setBookingError] = useState(null); // <-- Add this

  const { trip_type = null } = bookingPayload.preferences;

  const [bookingOrderData, setBookingOrderData] = useState(null);
  const hasBookedRef = useRef(false);

  if (
    !bookingPayload ||
    !trip_type ||
    ![
      TRIP_TYPES.LOCAL,
      TRIP_TYPES.OUTSTATION,
      TRIP_TYPES.AIRPORT_PICKUP,
      TRIP_TYPES.AIRPORT_DROPOFF,
    ].includes(trip_type) ||
    !bookingPayload.option
  ) {
    throw new Error(
      "No booking data found. Please complete the search and selection process before booking.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI
  }

  const bookingApi = useInitiateTripBookingMutation();

  // Lazy load feature-specific booking components
  const LocalHourlyRentalBooking = lazy(() =>
    import("@/features/localHourlyRental/LocalHourlyRentalBooking").then(
      (m) => ({ default: m.LocalHourlyRentalBooking }),
    ),
  );
  const AirportTransferBooking = lazy(() =>
    import("@/features/airportTransfers/AirportTransferBooking").then((m) => ({
      default: m.AirportTransferBooking,
    })),
  );

  const OutstationBooking = lazy(() =>
    import("@/features/outstation/OutstationBooking").then((m) => ({
      default: m.OutstationBooking,
    })),
  );

  useEffect(() => {
    if (!bookingPayload || hasBookedRef.current) return;
    hasBookedRef.current = true;
    const initiateBooking = async () => {
      try {
        const {
          car_type = CAB_TYPES.SEDAN,
          fuel_type = CAB_FUEL_TYPES.DIESEL,
        } = bookingPayload.option;

        const updatedPreferences = {
          ...bookingPayload.preferences,
          preferred_car_type: car_type, // Override the preferred car type with the selected option
          preferred_fuel_type: fuel_type, // Override the preferred fuel type with the selected option
          retrieve_fleet: true, // Add this flag to indicate that we want the API to return fleet data along with booking initiation
        };

        const response = await bookingApi.mutateAsync({
          option: bookingPayload.option,
          preferences: updatedPreferences,
          metadata: bookingPayload.metadata,
        });
        setBookingOrderData(response?.data || null);
      } catch (error) {
        const bookingInitiationError = new Error(
          error?.response?.data?.detail ||
            "Unexpected error occurred while initiating the booking. Please try again later.",
          {
            cause: error?.response?.data?.error_code || SERVER_ERROR_CODES.UNKNOWN_ERROR,
          },
        );
        bookingInitiationError.name = "BookingInitiationError";
        setBookingError(bookingInitiationError); // <-- Set error state
      }
    };

    initiateBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingPayload]);
  if (bookingError) {
    const cause = bookingError?.cause || SERVER_ERROR_CODES.UNKNOWN_ERROR;
    if (cause === SERVER_ERROR_CODES.ALREADY_BOOKED_ON_THIS_SLOT) {
      return (
        <FeedbackState
          variant="warning"
          title="You already have a booking around this time"
          message="Cabbo cannot create another booking that overlaps with an existing trip. Please check your trips, or go back and choose a different time."
          primaryAction={
            <button
              type="button"
              onClick={() => navigate(ROUTES.TRIPS)}
              className="cursor-pointer inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              View my trips
            </button>
          }
          secondaryAction={
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer inline-flex h-11 items-center justify-center rounded-md border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Go back
            </button>
          }
        />
      );
    }
    // For other issues, we will throw the error to be caught by the Error Boundary, which will show a user-friendly fallback UI.
    throw bookingError;
    // Error Boundary can catch this and show user-friendly fallback UI
  }

  if (!bookingOrderData) {
    return <Loader message="Initiating your booking..." />;
  }

  // Render the correct booking component based on trip type
  let BookingComponent = null;
  switch (trip_type) {
    case TRIP_TYPES.LOCAL:
      BookingComponent = (
        <LocalHourlyRentalBooking
          orderData={bookingOrderData}
          bookingData={bookingPayload}
        />
      );
      break;
    case TRIP_TYPES.OUTSTATION:
      BookingComponent = (
        <OutstationBooking
          orderData={bookingOrderData}
          bookingData={bookingPayload}
        />
      );
      break;
    case TRIP_TYPES.AIRPORT_PICKUP:
    case TRIP_TYPES.AIRPORT_DROPOFF:
      BookingComponent = (
        <AirportTransferBooking
          orderData={bookingOrderData}
          bookingData={bookingPayload}
        />
      );
      break;
    default:
      throw new Error("Unsupported trip type. Cannot render booking details.");
    // Error Boundary can catch this and show user-friendly fallback UI
  }

  return (
    <Suspense fallback={<Loader message="Preparing your booking..." />}>
      {BookingComponent}
    </Suspense>
  );
}

export default BookingPage;
