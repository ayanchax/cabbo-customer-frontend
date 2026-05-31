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
  PaymentProcessingIllustration
} from "@/components";
import { useTimezone, useRazorPay, useToast, useOverlay } from "@/hooks";
import { SelectedPackage } from "@/features/localHourlyRental/components";
import { isDevMode } from "@/api";
import { SuccessOverlay } from "../../components/common/SuccessOverlay";
function LocalHourlyRentalBooking({ orderData, bookingData, fleetData }) {
  const navigate = useNavigate();
  const { timezone: tz_info } = useTimezone();
  const { showOverlay, hideOverlay } = useOverlay();
  
  const { onPay } = useRazorPay();
  const { showToast } = useToast();
  const [inProgressPayment, setInProgressPayment] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState({
    showPaymentSuccessOverlay: false,
    data: null, // Mock data for testing, replace with actual data from payment result
  });
  const origin = bookingData?.preferences?.origin || null;
  let dropOff = bookingData?.preferences?.destination || null;
  if (origin.place_id === dropOff?.place_id) {
    // If the origin and drop-off are the same, set dropOff to null to avoid confusion in the UI
    dropOff = null;
  }

  const startDate = { isoString: bookingData?.preferences?.start_date || null };
  if (!origin || !startDate.isoString) {
    throw new Error(
      "Missing required booking data: origin and start date are required.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }
  if (!bookingData?.option) {
    throw new Error(
      "Missing required booking data: selected trip option is required.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }
  const selectedPackage = bookingData?.selectedPackage || null;

  const selectedFleet =
    fleetData?.find((fleet) => fleet?.name === bookingData?.option?.car_type) ||
    null;

  const fleet = {
    capacity: selectedFleet?.capacity || null,
    car_type: bookingData?.option?.car_type || null,
    fuel_type: bookingData?.option?.fuel_type || null,
    rate_per_min: bookingData?.option?.rate_per_min || null,
    currency: bookingData?.option?.currency || null,
    description: selectedFleet?.description || null,
    inventory_cab_names: selectedFleet?.inventory_cab_names || null,
  };

  const fareData = {
    total_price: bookingData?.option?.total_price || null,
    price_breakdown: bookingData?.option?.price_breakdown || null,
    overages: bookingData?.option?.overages || null,
    inclusions: bookingData?.metadata?.inclusions || null,
    exclusions: bookingData?.metadata?.exclusions || null,
    disclaimers: bookingData?.disclaimers || null,
    refunds_and_cancellation_policies:
      bookingData?.refunds_and_cancellation_policies || null,
  };

  const handlePay = async () => {
    if (inProgressPayment) {
      // Prevent multiple clicks on Pay button
      return;
    }
    try {
      const overlayProps = {
              message: "Processing your payment...",
              illustration: (
                <PaymentProcessingIllustration className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64" />
              ),
              subtext: "Hang tight, we're confirming your booking and processing payment securely.",
            };
      showOverlay(overlayProps);
      return
      setInProgressPayment(true);
      const result = await onPay(orderData);
      if (!result || result instanceof Error) {
        if (isDevMode) {
          console.error(result?.message || "Payment failed");
        }
        // Pass to catch block to show user-friendly error message
        throw result instanceof Error ? result : new Error("Payment failed");
      } else {
        hideOverlay(); // Hide any loading overlay that might be present, so that our success overlay can be seen clearly without being covered by a loading spinner or backdrop. We want to make sure the user sees the confirmation message immediately after payment is successful, without any visual obstruction, to provide a satisfying user experience and clear feedback that their action was successful.
        // Payment was successful and verified, you can redirect the user or show a success message
        if (isDevMode) {
          console.log("Payment successful and verified:", result);
        }
        setPaymentSuccessData({
          showPaymentSuccessOverlay: true,
          data: result?.data || null,
        });
        setTimeout(() => {
          // Since we are navigating as next step in the event loop, we can be reasonably sure that the SuccessOverlay will render at least once before navigation happens, allowing the user to see the confirmation message.
          // Thus we do not need to close the overlay manually here, as navigating away will unmount this component and remove the overlay from view. If we wanted to navigate while keeping this component mounted (e.g. showing the same overlay on the next page), we would need to manage the visibility of the overlay with state and set it to false before navigating.
          navigate(`/booking/${result?.data?.booking_id}`, {
            state: {
              fromBookingConfirmation: true,
              data: result?.data || null, // Pass any relevant data to the trips page if needed
              tripId: orderData?.trip_id || null,
            },
          }); // Redirect to booking details page after successful payment and verification
        }, 3000); // Show success overlay for 3 seconds before redirecting to booking details page, so that user is satisfied that their action was successful before being taken to the next page. This also allows time for the success message to be read, and for the user to see the booking ID if it's displayed on the overlay. Adjust the duration as needed based on user feedback and testing.
      }
    } catch (error) {
      if (isDevMode) {
        console.error("Payment process encountered an error:", error);
      }
      hideOverlay(); // Hide any loading overlay that might be present
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
          label="Hourly Rental"
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
            timezone={tz_info?.timezone}
          />

          {/* Selected package */}
          {selectedPackage && (
            <SelectedPackage
              selectedPackage={selectedPackage}
              className=" mt-2 md:mb-4 mb-4"
            />
          )}

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
            You’ll be redirected to your booking details shortly…
          </div>
        </SuccessOverlay>
      )}
    </div>
  );
}

export { LocalHourlyRentalBooking };
