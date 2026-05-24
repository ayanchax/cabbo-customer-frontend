import React, { useMemo, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTripPackagesQuery, useTripPriorBookingWindowQuery } from "@/hooks";
import { InlineDateTimePicker } from "@/components";
import { PackageCards } from "@/features/localHourlyRental/components";
const DEFAULT_MINIMUM_BOOKING_HOURS = 6; // Default to 6 hours if API doesn't provide a value
function LocalHourlyRental() {
  const location = useLocation();
  const navigate = useNavigate();
  // Origin is passed in navigation state from previous step
  const origin = location.state?.pickup;
  const displayText = origin?.display_name ?? null;
  const full_address = origin?.address ?? null;
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
    const bookingWindow = priorBookingWindow || DEFAULT_MINIMUM_BOOKING_HOURS;
    const now = new Date();
    now.setHours(now.getHours() + bookingWindow);
    return now;
  }, [priorBookingWindow]);

  // State for form fields
  const [startDate, setStartDate] = useState(null); // ISO string
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [error, setError] = useState(null);

  const handleBook = () => {
    setError(null);
    if (!origin) {
      setError("Pickup location missing.");
      return;
    }
    if (!startDate) {
      setError("Please select a start date and time.");
      return;
    }
    if (!selectedPackageId) {
      setError("Please select a package.");
      return;
    }
    if (
      earliestRentalStartDate &&
      new Date(startDate) < earliestRentalStartDate
    ) {
      setError(
        `Start time must be at least ${priorBookingWindow || DEFAULT_MINIMUM_BOOKING_HOURS} hours from now.`,
      );
      return;
    }
    // Submit to /search API (not implemented here)
    // ...
    // navigate('/confirmation', { state: { ... } });
  };

  return (
    <div className="max-w-md mx-auto p-4">
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
            className="w-4 h-4 text-primary shrink-0"
            aria-label="Pickup location"
          />
          <span
            className={`block text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-medium truncate ${
              origin ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {displayText}
          </span>
        </div>

        {full_address && (
          <span className="block text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-gray-500 truncate">
            {full_address}
          </span>
        )}
      </div>

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

      {/* Error message */}
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      {/* Book button */}
      <button
        className="w-full cursor-pointer bg-primary text-white py-2 rounded font-semibold disabled:opacity-50"
        onClick={handleBook}
        disabled={!origin || !startDate || !selectedPackageId}
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
