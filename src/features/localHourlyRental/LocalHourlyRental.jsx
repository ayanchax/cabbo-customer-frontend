import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTripPackagesQuery , useTripPriorBookingWindowQuery} from "@/hooks";
import { DateTimePicker } from "@/components/common/datetime-picker";
import { roundToNextStep } from "@/components/common/datetime-picker";
// import PackageSelector from '@/components/PackageSelector';
const DEFAULT_MINIMUM_BOOKING_HOURS = 6; // Default to 6 hours if API doesn't provide a value
function LocalHourlyRental() {
  const location = useLocation();
  const navigate = useNavigate();
  // Origin is passed in navigation state from previous step
  const origin = location.state?.pickup;
  // Assume region_code/jurisdiction_code is part of origin or user context
  const region_code = origin?.region_code;
  const jurisdiction_code = origin?.region_code; // adjust if needed
  const trip_type = "local";

  // Fetch available packages
  const { data: packages, isLoading: packagesLoading } = useTripPackagesQuery(
    trip_type,
    region_code,
  );
  // Fetch prior booking window (hours)
  const { data: priorBookingWindow, isLoading: priorBookingWindowLoading } =
    useTripPriorBookingWindowQuery(trip_type, jurisdiction_code);
  // Validation: startDate must be at least [priorBookingWindow] hours from now
  const minStartDate = useMemo(() => {
    // Minimum start date is current time + prior booking window hours. If priorBookingWindow is not available, we won't enforce this constraint (we will set it to default 6 hours).
    // This means that, a customer can only book a rental starting at least [priorBookingWindow] hours in the future from now. For example, if priorBookingWindow is 6, and current time is 3 PM, then the earliest start time they can select is 9 PM onwards.
    const bookingWindow = priorBookingWindow || DEFAULT_MINIMUM_BOOKING_HOURS;
    const now = new Date();
    now.setHours(now.getHours() + bookingWindow);
    return now;
  }, [priorBookingWindow]);
  // State for form fields
  const [startDate, setStartDate] = useState(() => roundToNextStep(minStartDate)); // ISO string
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
    if (minStartDate && new Date(startDate) < minStartDate) {
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
      <h2 className="text-xl font-bold mb-4">Book an Hourly Rental</h2>

      {/* Display-only origin */}
      <div className="mb-4">
        <div className="text-gray-500 text-sm">Pickup location</div>
        <div className="font-medium">{origin?.display_name || "Not set"}</div>
      </div>

      {/* Start date/time picker */}
      <div className={`mb-4 ${priorBookingWindowLoading ? "opacity-50 pointer-events-none" : ""}`}>
        <label className="block text-gray-500 text-sm mb-1">
          Start date & time
        </label>
        {/* Replace with your DateTimePicker component */}
        <DateTimePicker
          value={startDate}
          onChange={setStartDate}
          label="Pickup date & time"
          placeholder="Select pickup schedule"
          minDateTime={minStartDate}
        />
      </div>

      {/* Package selection */}
      <div className="mb-4">
        <label className="block text-gray-500 text-sm mb-1">
          Select package
        </label>
        {/* Replace with your PackageSelector component */}
        <select
          className="border rounded px-2 py-1 w-full"
          value={selectedPackageId || ""}
          onChange={(e) => setSelectedPackageId(e.target.value || null)}
          disabled={packagesLoading}
        >
          <option value="">Choose a package…</option>
          {packages &&
            packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name || `${pkg.hours}h/${pkg.kms}km`}
              </option>
            ))}
        </select>
        {packagesLoading && (
          <div className="text-xs text-gray-400 mt-1">Loading packages…</div>
        )}
      </div>

      {/* Error message */}
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      {/* Book button */}
      <button
        className="w-full bg-primary text-white py-2 rounded font-semibold disabled:opacity-50"
        onClick={handleBook}
        disabled={!origin || !startDate || !selectedPackageId}
      >
        Book Now
      </button>
    </div>
  );
}

export { LocalHourlyRental };
