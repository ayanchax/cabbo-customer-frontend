import React, { useEffect, useState, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useInitiateTripBookingMutation } from "@/hooks";
import { Loader } from "@/components";
import { TRIP_TYPES } from "@/utils";

function BookingPage() {
  const location = useLocation();
  const bookingPayload = location.state?.bookingPayload;
  const trip_type =
    bookingPayload?.option?.trip_type || bookingPayload?.preferences || null;
  console.log(bookingPayload)
  const [bookingData, setBookingData] = useState(null);

  if (!bookingPayload || !trip_type) {
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
  // Future: const OutstationBooking = lazy(() => import("@/features/outstation/OutstationBooking"));
  // Future: const AirportBooking = lazy(() => import("@/features/airport/AirportBooking"));

  useEffect(() => {
    const initiateBooking = async () => {
      try {
        const response = await bookingApi.mutateAsync(bookingPayload);
        setBookingData(response?.data || null);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        throw new Error("Failed to initiate booking. Please try again later.");
        // Error Boundary can catch this and show user-friendly fallback UI
      }
    };
    initiateBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingPayload]);

  if (!bookingData) {
    return <Loader message="Initiating your booking..." />;
  }

  // Render the correct booking component based on trip type
  let BookingComponent = null;
  switch (trip_type) {
    case TRIP_TYPES.LOCAL:
      BookingComponent = <LocalHourlyRentalBooking {...bookingData} />;
      break;
    // case TRIP_TYPES.OUTSTATION:
    //   BookingComponent = <OutstationBooking {...bookingData} />;
    //   break;
    // case TRIP_TYPES.AIRPORT_PICKUP:
    // case TRIP_TYPES.AIRPORT_DROPOFF:
    //   BookingComponent = <AirportBooking {...bookingData} />;
    //   break;
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
