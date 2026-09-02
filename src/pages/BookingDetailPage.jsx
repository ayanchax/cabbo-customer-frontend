import React, { lazy, Suspense, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAnalytics, useTripBookingDetail } from "@/hooks";
import { FeedbackState, Loader } from "@/components";
import { ROUTES, SERVER_ERROR_CODES, TRIP_TYPES } from "@/utils";
import { ANALYTICS_EVENTS } from "@/analytics";

const LocalHourlyRentalBookingDetail = lazy(() =>
  import("@/features/localHourlyRental/LocalHourlyRentalBookingDetail").then(
    (m) => ({ default: m.LocalHourlyRentalBookingDetail }),
  ),
);

const AirportTransferBookingDetail = lazy(() =>
  import("@/features/airportTransfers/AirportTransferBookingDetail").then(
    (m) => ({ default: m.AirportTransferBookingDetail }),
  ),
);

const OutstationBookingDetail = lazy(() =>
  import("@/features/outstation/OutstationBookingDetail").then((m) => ({
    default: m.OutstationBookingDetail,
  })),
);

function BookingDetailPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { track } = useAnalytics();

  if (!bookingId) {
    throw new Error(
      "No booking ID provided. Please access this page through a valid booking link.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI
  }
  const {
    data: bookingDetailData,
    error,
    isLoading,
  } = useTripBookingDetail(bookingId);

  const errorCode = error?.response?.data?.error_code;
  const statusCode = error?.response?.status;
  const isTripNotFound =
    statusCode === 404 || errorCode === SERVER_ERROR_CODES.TRIP_NOT_FOUND;

  useEffect(() => {
    if (!bookingDetailData) return;

    track(ANALYTICS_EVENTS.BOOKING_DETAIL_VIEWED, {
      booking_id: bookingDetailData?.booking_id,
      trip_type: bookingDetailData?.trip_type?.trip_type,
      status: bookingDetailData?.status,
      occurrence_label: bookingDetailData?.label,
    });
  }, [bookingDetailData, track]);

  if (isTripNotFound) {
    return (
      <FeedbackState
        variant="warning"
        title="Trip not found"
        message="We couldn't find this booking. It may have been removed, expired, or the link may be incorrect."
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
            onClick={() => navigate(ROUTES.HOME)}
            className="cursor-pointer inline-flex h-11 items-center justify-center rounded-md border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Go home
          </button>
        }
      />
    );
  }

  if (error) {
    throw new Error("Failed to load booking details. Please refresh the page.");
    // Error Boundary can catch this and show user-friendly fallback UI with option to retry fetching the data
  }



  if (!bookingDetailData || isLoading) {
    return <Loader message="Loading your booking..." />;
  }

  // Trip type is essential to determine which booking detail component to render, so we validate its presence and value before proceeding
  const tripType = bookingDetailData?.trip_type?.trip_type || null; // Fallback to generic term if trip type is not available
  if (!tripType) {
    throw new Error("Invalid booking data received. Please contact support.");
    // Error Boundary can catch this and show user-friendly fallback UI with option to contact support
  }

  let TripBookingDetailComponent;
  switch (tripType) {
    case TRIP_TYPES.LOCAL:
      TripBookingDetailComponent = (
        <LocalHourlyRentalBookingDetail bookingDetail={bookingDetailData} />
      );
      break;
    case TRIP_TYPES.OUTSTATION:
      TripBookingDetailComponent = <OutstationBookingDetail bookingDetail={bookingDetailData} />;
      break;
    case TRIP_TYPES.AIRPORT_PICKUP:
    case TRIP_TYPES.AIRPORT_DROPOFF:
      TripBookingDetailComponent = <AirportTransferBookingDetail bookingDetail={bookingDetailData} />;
      break;
    default:
      throw new Error("Unsupported trip type. Cannot render booking details.");
    // Error Boundary can catch this and show user-friendly fallback UI
  }

  return (
    <Suspense fallback={<Loader message="Almost there..." />}>
      {TripBookingDetailComponent}
    </Suspense>
  );
}

export default BookingDetailPage;
