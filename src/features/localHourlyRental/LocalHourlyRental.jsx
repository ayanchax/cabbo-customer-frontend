import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTripPackagesQuery } from '@/hooks/query/useTripPackage';
import { useTripPriorBookingWindowQuery } from '@/hooks/query/useTripPriorBookingWindow';

// UI components (replace with your design system or custom components)
// import DateTimePicker from '@/components/DateTimePicker';
// import PackageSelector from '@/components/PackageSelector';

function LocalHourlyRental() {
  const location = useLocation();
  const navigate = useNavigate();
  // Origin is passed in navigation state from previous step
  const origin = location.state?.origin;
  // Assume region_code/jurisdiction_code is part of origin or user context
  const region_code = origin?.region_code;
  const jurisdiction_code = origin?.region_code; // adjust if needed
  const trip_type = 'local';

  // Fetch available packages
  const { data: packages, isLoading: packagesLoading } = useTripPackagesQuery(trip_type, region_code);
  // Fetch prior booking window (hours)
  const { data: priorBookingWindow, isLoading: windowLoading } = useTripPriorBookingWindowQuery(trip_type, jurisdiction_code);

  // State for form fields
  const [startDate, setStartDate] = useState(null); // ISO string
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [error, setError] = useState(null);

  // Validation: startDate must be at least [priorBookingWindow] hours from now
  const minStartDate = useMemo(() => {
    if (!priorBookingWindow) return null;
    const now = new Date();
    now.setHours(now.getHours() + priorBookingWindow);
    return now;
  }, [priorBookingWindow]);

  const handleBook = () => {
    setError(null);
    if (!origin) {
      setError('Pickup location missing.');
      return;
    }
    if (!startDate) {
      setError('Please select a start date and time.');
      return;
    }
    if (!selectedPackageId) {
      setError('Please select a package.');
      return;
    }
    if (minStartDate && new Date(startDate) < minStartDate) {
      setError(`Start time must be at least ${priorBookingWindow} hours from now.`);
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
        <div className="font-medium">{origin?.display_name || 'Not set'}</div>
      </div>

      {/* Start date/time picker */}
      <div className="mb-4">
        <label className="block text-gray-500 text-sm mb-1">Start date & time</label>
        {/* Replace with your DateTimePicker component */}
        <input
          type="datetime-local"
          className="border rounded px-2 py-1 w-full"
          value={startDate ? startDate.substring(0, 16) : ''}
          min={minStartDate ? minStartDate.toISOString().substring(0, 16) : ''}
          onChange={e => setStartDate(e.target.value ? new Date(e.target.value).toISOString() : null)}
          disabled={windowLoading}
        />
        {windowLoading && <div className="text-xs text-gray-400 mt-1">Loading booking window…</div>}
        {minStartDate && (
          <div className="text-xs text-gray-400 mt-1">
            Earliest allowed: {minStartDate.toLocaleString()}
          </div>
        )}
      </div>

      {/* Package selection */}
      <div className="mb-4">
        <label className="block text-gray-500 text-sm mb-1">Select package</label>
        {/* Replace with your PackageSelector component */}
        <select
          className="border rounded px-2 py-1 w-full"
          value={selectedPackageId || ''}
          onChange={e => setSelectedPackageId(e.target.value || null)}
          disabled={packagesLoading}
        >
          <option value="">Choose a package…</option>
          {packages && packages.map(pkg => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name || `${pkg.hours}h/${pkg.kms}km`}
            </option>
          ))}
        </select>
        {packagesLoading && <div className="text-xs text-gray-400 mt-1">Loading packages…</div>}
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