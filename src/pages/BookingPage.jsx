import React, { useContext, useEffect, useState, useRef, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAnalytics, useInitiateTripBookingMutation } from "@/hooks";
import { FeedbackState, Loader } from "@/components";
import {
  TRIP_TYPES,
  CAB_TYPES,
  SERVER_ERROR_CODES,
  SERVER_STATUS_CODES,
  ROUTES,
} from "@/utils";
import { ANALYTICS_EVENTS } from "@/analytics";
import { PaymentContext } from "@/payments";

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingPayload = location.state?.bookingPayload;
  const { track } = useAnalytics();
  const { restoreCheckout, pending, recoveryState } = useContext(PaymentContext);

  const [bookingError, setBookingError] = useState(null); // <-- Add this

  const { trip_type = null } = bookingPayload?.preferences || {};

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
        const { car_type = CAB_TYPES.SEDAN } = bookingPayload.option;

        const updatedPreferences = {
          ...bookingPayload.preferences,
          preferred_car_type: car_type, // Override the preferred car type with the selected option
          retrieve_fleet: true, // Add this flag to indicate that we want the API to return fleet data along with booking initiation
        };
        track(ANALYTICS_EVENTS.BOOKING_INITIATED, {
          trip_type,
          car_type,
          total_price: bookingPayload.option?.total_price,
          currency:
            bookingPayload.option?.currency?.code ||
            bookingPayload.option?.currency,
        });

        const response = await bookingApi.mutateAsync({
          option: bookingPayload.option,
          preferences: updatedPreferences,
          metadata: bookingPayload.metadata,
        });
        track(ANALYTICS_EVENTS.BOOKING_INITIATION_SUCCEEDED, {
          trip_type,
          trip_id: response?.data?.trip_id,
          order_id: response?.data?.order_id,
          car_type,
        });
        // Only a matching saved checkout needs a status GET. New reservations
        // proceed normally; interrupted ones require backend permission to retry.
        await restoreCheckout(response?.data);
        setBookingOrderData(response?.data || null);
      } catch (error) {
        track(ANALYTICS_EVENTS.BOOKING_INITIATION_FAILED, {
          trip_type,
          reason: error?.response?.data?.error_code || "unexpected_error",
        });
        const bookingInitiationError = new Error(
          error?.response?.data?.detail ||
            "Unexpected error occurred while initiating the booking. Please try again later.",
          {
            cause: error?.response?.data?.error_code || SERVER_ERROR_CODES.UNKNOWN_ERROR,
          },
        );
        bookingInitiationError.name = "BookingInitiationError";
        bookingInitiationError.status = error?.response?.status;
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
          message="We cannot create another booking that overlaps with an existing trip. Please check your trips, or go back and choose a different time."
          primaryAction={
            <button
              type="button"
              onClick={() => navigate(ROUTES.MY_TRIPS)}
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
    if (bookingError.status === SERVER_STATUS_CODES.CONFLICT) {
      // A conflict is an expected booking outcome, not an application crash.
      // The legacy response has no trip ID: offer saved recovery explicitly
      // rather than assuming that any stored checkout caused this conflict.
      return (
        <FeedbackState
          variant="warning"
          title="We couldn't continue this booking"
          message="We couldn't confirm your booking yet. Please check your booking status or Upcoming Trips before starting a new booking."
          primaryAction={
            <button
              type="button"
              onClick={() => pending?.temp_trip_id
                ? navigate(ROUTES.PAYMENT_PENDING_CONFIRMATION, { replace: true, state: recoveryState })
                : navigate(`${ROUTES.MY_TRIPS}?tab=upcoming`)}
              className="cursor-pointer inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {pending?.temp_trip_id ? "Check booking status" : "Upcoming Trips"}
            </button>
          }
          secondaryAction={
            <button
              type="button"
              onClick={() => navigate(pending?.temp_trip_id ? `${ROUTES.MY_TRIPS}?tab=upcoming` : ROUTES.HOME)}
              className="cursor-pointer inline-flex min-h-11 items-center justify-center rounded-md border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {pending?.temp_trip_id ? "Upcoming Trips" : "Back to home"}
            </button>
          }
        />
      );
    }
    // Unexpected failures still use the application error boundary.
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
