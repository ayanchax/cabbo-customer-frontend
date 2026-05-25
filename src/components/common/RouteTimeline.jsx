import React from "react";

/**
 * RouteTimeline
 *
 * A reusable readonly component for displaying a pickup and (optionally) dropoff location timeline, with support for hops and time metadata.
 *
 * **Purpose:**
 * - Centralizes the UI for showing route details (pickup, dropoff, hops) in booking flows and trip detail listings.
 * - Ensures consistent styling and logic across all flows (booking, trip details, etc.) so we don't have to rewrite or restyle the same code in multiple places.
 *
 * **Props:**
 * - `pickupLocation` (object, required): Location object for pickup (lat, lng, display_name, full_address, etc.)
 * - `dropoffLocation` (object, optional): Location object for dropoff (same shape as pickupLocation)
 * - `hops` (array, optional): Array of intermediate stops, each with a location and time
 * - `pickupTime` (optional): Scheduled or estimated pickup time
 * - `dropoffTime` (optional): Estimated dropoff time
 *
 * **Usage:**
 * - Use in any booking flow, ride summary, or trip details view to avoid duplicating timeline UI and logic.
 * - Designed for easy extension (add hops, show times, etc.) and consistent responsive styling.
 *
 * Example:
 *   <RouteTimeline pickupLocation={pickup} dropoffLocation={dropoff} hops={hops} />
 */
import { MapPin } from "lucide-react";

function RouteTimeline({
  pickupLocation = {
    lat: null,
    lng: null,
    display_name: null,
    address: null,
    country: null,
    country_code: null,
    region: null,
    region_code: null,
    state: null,
    state_code: null,
    postal_code: null,
    place_id: null,
  }, // Required
  dropoffLocation = {
    lat: null,
    lng: null,
    display_name: null,
    address: null,
    country: null,
    country_code: null,
    region: null,
    region_code: null,
    state: null,
    state_code: null,
    postal_code: null,
    place_id: null,
  }, // Optional
  // eslint-disable-next-line no-unused-vars
  hops = [], // Array of { location, time }
  // eslint-disable-next-line no-unused-vars
  pickupTime, // Optional, can be used to show scheduled pickup time or estimated time of arrival at pickup
  // eslint-disable-next-line no-unused-vars
  dropoffTime, // Optional, can be used to show estimated dropoff time

  gap = "16px", // Customizable gap between pickup, hops, and dropoff for better visual separation

  viewAsRouteTimeline = true, // If true, shows the vertical line connecting pickup and dropoff. If false, just shows the locations without the line, for a more compact display (e.g. in trip summary cards)

  showPickupLabel = false, // Optionally show "Pickup" label above pickup location
  showDropoffLabel = false, // Optionally show "Dropoff" label above dropoff location

  pickupIcon = (
    <MapPin
      className="w-4 h-4 text-primary shrink-0 "
      aria-label="Pickup location"
    />
  ), // Customizable pickup icon
  dropoffIcon = (
    <MapPin
      className="w-4 h-4 text-primary shrink-0 "
      aria-label="Dropoff location"
    />
  ), // Customizable dropoff icon

}) {
  return (
    <>
      {viewAsRouteTimeline &&
      dropoffLocation &&
      dropoffLocation.display_name ? (
        <div style={{ marginBottom: gap }} className="flex">
          {/* Timeline column: dots and line aligned with content */}
          <div className="flex flex-col items-center mr-2 relative" style={{ width: 20 }}>
            {/* Pickup dot */}
            <span className="sm:w-3 sm:h-3 w-2 h-2 md:w-4 md:h-4 rounded-full border border-white shadow-sm z-10 bg-emerald-400 block" />
            {/* Vertical line: flex-grow, stretches between dots */}
            <div className="flex-1 w-px bg-gray-200 opacity-60" />
            {/* Drop dot */}
            <span className="sm:w-3 sm:h-3 w-2 h-2 md:w-4 md:h-4 rounded-full bg-rose-400 border border-white shadow-sm z-10 block" />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {/* Pickup location */}
            <div style={{ marginBottom: gap }}>
              {showPickupLabel && <div className="text-gray-500 text-[13px] md:text-base mb-1">Pickup</div>}
              <div className="flex items-center gap-1">
                {pickupIcon}
                <span className={`block text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-medium truncate ${pickupLocation.display_name ? "text-gray-900" : "text-gray-400"}`}>{pickupLocation.display_name}</span>
              </div>
              {pickupLocation.address && (
                <span className="block text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-gray-500 truncate">{pickupLocation.address}</span>
              )}
            </div>
            {/* Dropoff location */}
            <div>
              {showDropoffLabel && <div className="text-gray-500 text-[13px] md:text-base mb-1">Dropoff</div>}
              <div className="flex items-center gap-1">
                {dropoffIcon}
                <span className={`block text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-medium truncate ${dropoffLocation.display_name ? "text-gray-900" : "text-gray-400"}`}>{dropoffLocation.display_name}</span>
              </div>
              {dropoffLocation.address && (
                <span className="block text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-gray-500 truncate">{dropoffLocation.address}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Pickup location */}
          <div style={{ marginBottom: gap }}>
            <div className="text-gray-500 text-[13px] md:text-base mb-1">
              Pickup location
            </div>
            <div className="flex items-center gap-1">
              {pickupIcon}
              <span
                className={`block text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-medium truncate ${pickupLocation.display_name ? "text-gray-900" : "text-gray-400"}`}
              >
                {pickupLocation.display_name}
              </span>
            </div>
            {pickupLocation.address && (
              <span className="block text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-gray-500 truncate">
                {pickupLocation.address}
              </span>
            )}
          </div>
          {/* We will add hops here in the future */}

          {/* Dropoff location (if present) */}
          {dropoffLocation && dropoffLocation.display_name && (
            <div className="" style={{ marginBottom: gap }}>
              <div className="text-gray-500 text-[13px] md:text-base mb-1">
                Dropoff location
              </div>
              <div className="flex items-center gap-1">
                {dropoffIcon}
                <span
                  className={`block text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-medium truncate ${dropoffLocation.display_name ? "text-gray-900" : "text-gray-400"}`}
                >
                  {dropoffLocation.display_name}
                </span>
              </div>
              {dropoffLocation.address && (
                <span className="block text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-gray-500 truncate">
                  {dropoffLocation.address}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

export { RouteTimeline };
