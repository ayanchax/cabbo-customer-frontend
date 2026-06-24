import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useInitiateTripBookingMutation } from "@/hooks";
import { Loader } from "@/components";
import { TRIP_TYPES } from "@/utils";

function BookingPage() {
  const location = useLocation();
  const bookingPayload = location.state?.bookingPayload;
  const [bookingError, setBookingError] = useState(null); // <-- Add this

  const {trip_type= null} = bookingPayload.preferences 
    
  const [bookingOrderData, setBookingOrderData] = useState(null);
  const hasBookedRef = useRef(false);


  if (!bookingPayload || !trip_type || ![TRIP_TYPES.LOCAL, TRIP_TYPES.OUTSTATION, TRIP_TYPES.AIRPORT_PICKUP, TRIP_TYPES.AIRPORT_DROPOFF].includes(trip_type) || !bookingPayload.option) {
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
  const AirportTransferBooking = lazy(() => import("@/features/airportTransfers/AirportTransferBooking").then(
    (m) => ({ default: m.AirportTransferBooking }),
  ));

  const OutstationBooking = lazy(() => import("@/features/outstation/OutstationBooking").then(
    (m) => ({ default: m.OutstationBooking }),
  ));



  useEffect(() => {
    if (!bookingPayload || hasBookedRef.current) return;
    hasBookedRef.current = true;
    const initiateBooking = async () => {
      try {
        const updatedPreferences = {
          ...bookingPayload.preferences,
          retrieve_fleet: true, // Add this flag to indicate that we want the API to return fleet data along with booking initiation
        };
        
        const response = await bookingApi.mutateAsync({
          option:bookingPayload.option,
          preferences:updatedPreferences,
          metadata:bookingPayload.metadata
        });
        setBookingOrderData(response?.data || null);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setBookingError(new Error("Failed to initiate booking. Please try again later.")); // <-- Set error state
      }
    };
    
    initiateBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingPayload]);
  if (bookingError) {
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
      BookingComponent = <LocalHourlyRentalBooking orderData={bookingOrderData} bookingData={bookingPayload} />;
      break;
    case TRIP_TYPES.OUTSTATION:
      BookingComponent = <OutstationBooking orderData={bookingOrderData} bookingData={bookingPayload} />;
      break;
    case TRIP_TYPES.AIRPORT_PICKUP:
    case TRIP_TYPES.AIRPORT_DROPOFF:
      BookingComponent = <AirportTransferBooking orderData={bookingOrderData} bookingData={bookingPayload} />;
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
