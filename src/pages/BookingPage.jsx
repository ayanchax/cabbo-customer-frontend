import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useInitiateTripBookingMutation, useFleetQuery } from "@/hooks";
import { Loader } from "@/components";
import { TRIP_TYPES } from "@/utils";

function BookingPage() {
  const location = useLocation();
  const bookingPayload = location.state?.bookingPayload;
  const {trip_type= null} = bookingPayload.preferences 
    
  const [bookingOrderData, setBookingOrderData] = useState(null);
  const hasBookedRef = useRef(false);


  if (!bookingPayload || !trip_type) {
    throw new Error(
      "No booking data found. Please complete the search and selection process before booking.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI
  }

  const {data:fleetData, error:fleetError, isLoading:fleetLoading} = useFleetQuery(!!bookingPayload); // Don't fetch fleet data until bookingPayload is available, as we need the trip type from the payload to fetch the relevant fleet data
  

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
    if (!bookingPayload || hasBookedRef.current) return;
    hasBookedRef.current = true;
    const initiateBooking = async () => {
      try {
        const response = await bookingApi.mutateAsync(bookingPayload);
        setBookingOrderData(response?.data || null);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        throw new Error("Failed to initiate booking. Please try again later.");
        // Error Boundary can catch this and show user-friendly fallback UI
      }
    };
    
    initiateBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingPayload]);

  if (fleetError) {
    throw new Error("Failed to load fleet data. Please refresh the page.");
    // Error Boundary can catch this and show user-friendly fallback UI with option to retry fetching fleet data
  }


  if (!bookingOrderData || fleetLoading) {
    return <Loader message="Initiating your booking..." />;
  }

  // Render the correct booking component based on trip type
  let BookingComponent = null;
  switch (trip_type) {
    case TRIP_TYPES.LOCAL:
      BookingComponent = <LocalHourlyRentalBooking orderData={bookingOrderData} bookingData={bookingPayload} fleetData={fleetData} />;
      break;
    // case TRIP_TYPES.OUTSTATION:
    //   BookingComponent = <OutstationBooking {...bookingOrderData} />;
    //   break;
    // case TRIP_TYPES.AIRPORT_PICKUP:
    // case TRIP_TYPES.AIRPORT_DROPOFF:
    //   BookingComponent = <AirportBooking {...bookingOrderData} />;
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
