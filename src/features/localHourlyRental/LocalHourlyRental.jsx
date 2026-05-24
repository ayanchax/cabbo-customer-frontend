import React, { useMemo, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useTripPackagesQuery,
  useTripPriorBookingWindowQuery,
  useToast,
  useTimezone,
  useOverlay
} from "@/hooks";
import { InlineDateTimePicker , GettingRideOptionsIllustration, RideMetaDataPreferences} from "@/components";
import { PackageCards } from "@/features/localHourlyRental/components";
const DEFAULT_MINIMUM_BOOKING_HOURS = 6; // Default to 6 hours if API doesn't provide a value
function LocalHourlyRental() {
  const location = useLocation();
  const { timezone: tz_info } = useTimezone();
  const { showOverlay, hideOverlay } = useOverlay();
  
 
  // Origin is passed in navigation state from previous step
  const origin = location.state?.pickup;
  
  if (!origin) {
    throw new Error(
      "Origin (pickup location) is required to book a local hourly rental.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }
  const dropOff = location.state?.dropoff; // Optional dropoff location for display purposes, but we will not require it for booking since some rentals may not have a fixed dropoff location
  const { showToast } = useToast();
  const navigate = useNavigate();
  const originDisplayText = origin?.display_name ?? null;
  const originFullAddress = origin?.address ?? null;
  const dropOffDisplayText = dropOff?.display_name ?? null;
  const dropOffFullAddress = dropOff?.address ?? null;
  
  const region_code = origin?.region_code;
  const trip_type = "local";

  // Fetch available packages
  const { data: packages, isLoading: packagesLoading } = useTripPackagesQuery(
    trip_type,
    region_code,
  );
  // Fetch prior booking window (hours)
  const { data: priorBookingWindow, isLoading: priorBookingWindowLoading } =
    useTripPriorBookingWindowQuery(trip_type, region_code);

  // Validation: startDate must be at least [priorBookingWindow] hours from now
  const earliestRentalStartDate = useMemo(() => {
    // Minimum start date is current time + prior booking window hours. If priorBookingWindow is not available, we won't enforce this constraint (we will set it to default 6 hours).
    // This means that, a customer can only book a rental starting at least [priorBookingWindow] hours in the future from now. For example, if priorBookingWindow is 6, and current time is 3 PM, then the earliest start time they can select is 9 PM onwards.
    // We do not throw error if priorBookingWindow is not available, because we want to allow booking without this constraint rather than blocking the entire flow. Instead, we will just use a default value for calculating earliestRentalStartDate, but we won't show any error to user about missing priorBookingWindow.
    const bookingWindow = priorBookingWindow || DEFAULT_MINIMUM_BOOKING_HOURS;
    const now = new Date();
    now.setHours(now.getHours() + bookingWindow);
    return now;
  }, [priorBookingWindow]);

  // State for form fields
  const [startDate, setStartDate] = useState(null); // ISO string
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [ridePreferences, setRidePreferences] = useState({ num_adults: 1, num_children: 0 }); // Example additional preferences
  const [inProgress, setInProgress] = useState(false);

  const handleBook = () => {
    if(inProgress) return; // Prevent multiple submissions
    try {
      setInProgress(true);
      if (!origin) {
        const msg =
          "Pickup location is required to book a local hourly rental.";
        showToast(msg, "error", {position: "top-center"});

        return;
      }
      if (!startDate) {
        const msg = "Please select a start date and time.";
        showToast(msg, "error", {position: "top-center"});
        return;
      }
      if (!selectedPackageId) {
        const msg = "Please select a package.";
        showToast(msg, "error", {position: "top-center"});
        return;
      }
      if (
        earliestRentalStartDate &&
        new Date(startDate) < earliestRentalStartDate
      ) {
        const msg = `Start time must be at least ${priorBookingWindow || DEFAULT_MINIMUM_BOOKING_HOURS} hours from now.`;
        showToast(msg, "error", {position: "top-center"});
        return;
      }
      const overlayProps= {
            message: "Getting the best rides for you...",
            illustration: <GettingRideOptionsIllustration className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64" />,
            subtext: "Searching available cabs and packages in your area",
          }
      showOverlay(overlayProps);
      console.log(origin, startDate, selectedPackageId, tz_info);

      // Submit to /search API (not implemented here)
      // ...
      // navigate('/confirmation', { state: { ... } });
    } catch (e) {
      console.error("Error during booking:", e);
      const msg = "An unexpected error occurred. Please try again.";
      showToast(msg, "error", {position: "top-center"});
    }

    finally {
      setInProgress(false);
    }
  };

  return (
    <div  className={`max-w-md mx-auto p-4 ${inProgress ? "pointer-events-none opacity-70" : ""}`}>
      {/* Header: Back Button + Title */}
      <div className="flex items-center gap-2 mb-4">
        <button
          className="flex items-center text-primary hover:underline text-sm font-medium cursor-pointer"
          onClick={() => navigate(-1)}
          type="button"
          aria-label="Go back"
        >
          <ArrowLeft className="mr-1 w-4 h-4" />
        </button>
        <h2 className="text-xl font-bold ml-2">
          Plan your hourly rental ride
          {/* Suggestions:
            Book an Hourly Rental
            Start Your Hourly Ride
            Schedule Your Local Rental
            Hourly Rental Booking
            */}
        </h2>
      </div>

      {/* Pickup location */}
      <div className="mb-4">
        <div className="text-gray-500 text-sm mb-1">Pickup location</div>
        <div className="flex items-center gap-1">
          <MapPin
            className="w-4 h-4 text-primary shrink-0 "
            aria-label="Pickup location"
          />
          <span
            className={`block text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-medium truncate ${
              origin ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {originDisplayText}
          </span>
        </div>

        {originFullAddress && (
          <span className="block text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-gray-500 truncate">
            {originFullAddress}
          </span>
        )}
      </div>

      {/* Optional dropoff location */}
      {dropOff && (
        <div className="mb-4">
          <div className="text-gray-500 text-sm mb-1">Dropoff location</div>
          <div className="flex items-center gap-1">
            <MapPin
              className="w-4 h-4 text-primary shrink-0 "
              aria-label="Dropoff location"
            />
            <span
              className={`block text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-medium truncate ${
                dropOff ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {dropOffDisplayText}
            </span>
          </div>

          {dropOffFullAddress && (
            <span className="block text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-gray-500 truncate">
              {dropOffFullAddress}
            </span>
          )}
        </div>
      )}

      {/* Start date/time picker */}
      <div
        className={`mb-4 ${priorBookingWindowLoading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <label
          htmlFor="startDateTime"
          className="block text-gray-500 text-sm mb-2"
        >
          When do you want to leave?
          {/* Suggestions:
          Select start date & time
          Pick your ride start time
          Choose when your ride begins
          When should your ride start?
          */}
        </label>
        <InlineDateTimePicker
          id="startDateTime"
          earliestRentalStartDate={earliestRentalStartDate}
          onConfirm={setStartDate}
        />
      </div>

      {/* Package selection */}
      <div className="mb-4">
        <label className="block text-gray-500 text-sm mb-2">
          Select package
        </label>
        <PackageCards
          packages={packages}
          selectedPackageId={selectedPackageId}
          onSelect={setSelectedPackageId}
          loading={packagesLoading}
        />
      </div>

      {/* Optional: Passenger information like num_adults and children */}
      <div className="mb-4">
         <label htmlFor="ridePreferences" className="block text-gray-500 text-sm mb-2">
          Preferences
        </label>
        <RideMetaDataPreferences value={ridePreferences} onChange={setRidePreferences} id="ridePreferences"/>
      </div>
     
      {/* Book button */}
      <button
        className="w-full cursor-pointer bg-primary text-white py-2 rounded font-semibold disabled:opacity-50"
        onClick={handleBook}
        disabled={!origin || !startDate || !selectedPackageId || inProgress}
      >
        Find rides
        {/* Suggestions:
          Book Now
          Search Rides
          Find My Ride
          See Available Rides
          */}
      </button>
    </div>
  );
}

export { LocalHourlyRental };
