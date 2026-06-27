import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useTripBookingDetail } from "@/hooks";
import { Loader } from "@/components";
import { TRIP_TYPES , TRIP_STATUS} from "@/utils";

function BookingDetailPage() {
  const { bookingId } = useParams();
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

  // Lazy load feature-specific booking components
  const LocalHourlyRentalBookingDetail = lazy(() =>
    import("@/features/localHourlyRental/LocalHourlyRentalBookingDetail").then(
      (m) => ({ default: m.LocalHourlyRentalBookingDetail }),
    ),
  );
   
  const AirportTransferBookingDetail = lazy(() => import("@/features/airportTransfers/AirportTransferBookingDetail").then(
    (m) => ({ default: m.AirportTransferBookingDetail }),
  ));

  const OutstationBookingDetail = lazy(() => import("@/features/outstation/OutstationBookingDetail").then(
    (m) => ({ default: m.OutstationBookingDetail }),
  ));

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
