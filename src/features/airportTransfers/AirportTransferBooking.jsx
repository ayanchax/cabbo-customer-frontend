import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RideTimings,
  RouteTimeline,
  PageHeader,
  TripDisclaimer,
  TripPaymentSummary,
  TripCabDetails,
  InCarAmenities,
  PaymentProcessingIllustration,
} from "@/components";
import { useTimezone, useRazorPay, useToast } from "@/hooks";
import { isDevMode } from "@/api";
import { SuccessOverlay } from "@/components";
import { DEFAULT_USER_TIMEZONE, TRIP_TYPES } from "@/utils";
function AirportTransferBooking({ orderData, bookingData }) {
  if (isDevMode) {
  console.log(bookingData);
  }
  const navigate = useNavigate();
  const { timezone: client_timezone } = useTimezone();

  const { onPay } = useRazorPay();
  const { showToast } = useToast();
  const [inProgressPayment, setInProgressPayment] = useState(false);

  const [paymentSuccessData, setPaymentSuccessData] = useState({
    showPaymentSuccessOverlay: false,
    data: null, // Mock data for testing, replace with actual data from payment result
  });
  const origin = bookingData?.preferences?.origin || null;
  const dropOff = bookingData?.preferences?.destination || null;

  const startDate = { isoString: bookingData?.preferences?.start_date || null };
  if (!origin || !dropOff || !startDate.isoString) {
    throw new Error(
      "Missing required booking data: origin, drop-off, and start date are required.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }
  if (!bookingData?.option) {
    throw new Error(
      "Missing required booking data: selected trip option is required.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }
  
  const selectedFleet = orderData?.fleet || null;

  const fleet = {
    capacity: selectedFleet?.capacity || null,
    car_type: bookingData?.option?.car_type || null,
    fuel_type: bookingData?.option?.fuel_type || null,
    currency: bookingData?.option?.currency || null,
    description: selectedFleet?.description || null,
    inventory_cab_names: selectedFleet?.inventory_cab_names || null,
  };

  const priceBreakdown = bookingData?.option?.price_breakdown || null;
  const lockedAddOnKeys = [];

  if (
    bookingData?.preferences?.toll_road_preferred &&
    priceBreakdown?.toll
  ) {
    lockedAddOnKeys.push("toll");
  }

  if (
    bookingData?.preferences?.placard_required &&
    priceBreakdown?.placard_charge
  ) {
    lockedAddOnKeys.push("placard_charge");
  }

  const fareData = {
    total_price: bookingData?.option?.total_price || null,
    price_breakdown: priceBreakdown,
    overages: bookingData?.option?.overages || null,
    inclusions: bookingData?.metadata?.inclusions || null,
    exclusions: bookingData?.metadata?.exclusions || null,
    disclaimers: bookingData?.disclaimers || null,
    refunds_and_cancellation_policies:
      bookingData?.refunds_and_cancellation_policies || null,
    locked_add_on_keys: lockedAddOnKeys,
    add_on_disclaimer:
      "Selected add-on services are included in this fare. Once confirmed, they cannot be removed from the booking.",
  };

  const server_timezone = bookingData?.preferences?.timezone || null;

  const getPageHeaderLabel = () => {
    if (bookingData?.trip_type === TRIP_TYPES.AIRPORT_PICKUP) {
      return "Airport pickup";
    } else if (bookingData?.trip_type === TRIP_TYPES.AIRPORT_DROPOFF) {
      return "Airport drop-off";
    } else {
      return "Airport transfer";
    }
  };
  const handlePay = async () => {
    if (inProgressPayment) {
      // Prevent multiple clicks on Pay button
      return;
    }
    try {
      setInProgressPayment(true);
      const overlayProps = {
        message: "Finalizing your booking...",
        illustration: (
          <PaymentProcessingIllustration className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64" />
        ),
        subtext:
          "Hang tight! We're confirming your booking and processing your payment.",
      };
      const result = await onPay(orderData, overlayProps);
      if (result && result?.data) {
        setPaymentSuccessData({
          showPaymentSuccessOverlay: true,
          data: result?.data || null,
        });
        if (isDevMode) {
          console.log("Payment successful and verified:", result);
        }
      } else {
        if (isDevMode) {
          console.error(result?.message || "Payment failed");
        }
        throw result instanceof Error ? result : new Error("Payment failed");
      }
    } catch (error) {
      if (isDevMode) {
        console.error("Payment process encountered an error:", error);
      }
      setPaymentSuccessData({
        showPaymentSuccessOverlay: false,
        data: null,
      });
      const msg =
        "Payment failed. Please try again. If you were charged, contact support.";
      showToast(msg, "error", { position: "top-center" });
      // User stays on the same screen and can retry
    } finally {
      setInProgressPayment(false);
    }
  };

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
          ${inProgressPayment ? "pointer-events-none opacity-70" : "pointer-events-auto"}
        `}
    >
      <div className="relative z-10">
        {/* Page header */}
        <PageHeader
          onBack={() => navigate(-1)}
          title="Review and confirm your booking"
          className="px-0 mb-4"
          label={getPageHeaderLabel()}
        />
        <div className="px-4">
          <div className="py-2"></div>

          {/* Cab details */}
          <TripCabDetails cabDetails={fleet} className="mb-4  py-2 px-0" />

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
              client_timezone?.timezone ||
              server_timezone ||
              DEFAULT_USER_TIMEZONE
            }
          />

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
              <TripPaymentSummary
                orderData={orderData}
                fareData={fareData}
                onPay={handlePay}
              />
            </div>
          )}
        </div>
      </div>

      {/* Success overlay */}
      {paymentSuccessData?.showPaymentSuccessOverlay && (
        <SuccessOverlay
          visible={paymentSuccessData?.showPaymentSuccessOverlay}
          message="Booking Confirmed"
          route={`/booking/${paymentSuccessData?.data?.booking_id}`}
          routeState={{
            fromBookingConfirmation: true,
            data: paymentSuccessData?.data || null,
            tripId: orderData?.trip_id || null,
          }}
        >
          {paymentSuccessData?.data?.booking_id && (
            <div className="text-white text-sm opacity-90">
              Booking ID: {paymentSuccessData?.data?.booking_id || "N/A"}
            </div>
          )}
          <div className="text-white text-xs opacity-70 mt-1">
            You'll be redirected to your booking details shortly…
          </div>
        </SuccessOverlay>
      )}
    </div>
  );
}

export { AirportTransferBooking };
