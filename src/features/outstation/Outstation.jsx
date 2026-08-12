import React, { useLayoutEffect, useMemo, useState } from "react";
import { addDays } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useTripPriorBookingWindowQuery,
  useToast,
  useTimezone,
  useOverlay,
  useTripTypeConstraintsQuery,
} from "@/hooks";
import {
  InlineDateTimePicker,
  GettingRideOptionsIllustration,
  RideMetaDataPreferences,
  TripOptionsList,
  RideTimings,
  RouteTimeline,
  PageHeader,
  TripDisclaimer,
  OutstationRoutePlanningIllustration,
  IncludedServicePills,
  NoRidesAvailable
} from "@/components";

import {
  OutstationHopManager,
  RoundTripOnlyDisclaimer,
  OutstationPackage
} from "@/features/outstation/components";
import {
  useOutstationTripSearch,
  useOutstationServices,
} from "@/features/outstation/hooks";
import { isDevMode } from "@/api";
import { ROUTES, DEFAULT_USER_TIMEZONE, enrichOptionsWithRates } from "@/utils";
const DEFAULT_MINIMUM_BOOKING_HOURS = 48; // Default to 48 hours if API doesn't provide a value

function Outstation() {
  const location = useLocation();
  const { timezone: client_timezone } = useTimezone();
  const { showOverlay, hideOverlay } = useOverlay();
  const searchTrips = useOutstationTripSearch();
  // Origin is passed in navigation state from previous step

  //Origin and drop off are required for outstation trips, but we will do validation and show error if they are not present in the navigation state, rather than blocking the entire flow by making them required in the type definition of the navigation state, because there is a possibility that these values might not be passed correctly from the previous step due to a bug or some unexpected issue, and we don't want to completely block the user from booking an outstation trip in that case. By allowing the flow to continue and showing a user-friendly error message about missing data, we can still allow the user to book an outstation trip by going back and re-selecting their pickup and drop-off locations, rather than forcing them to restart the entire booking process.
  const origin = location.state?.pickup;

  const dropOff = location.state?.dropoff;

  if (!origin) {
    throw new Error(
      "Origin (pickup location) is required to book an outstation trip.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }
  if (!dropOff) {
    throw new Error(
      "Drop-off location is required to book an outstation trip.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }

  const { showToast } = useToast();
  const navigate = useNavigate();

  const state_code = origin?.state_code || null;
  const trip_type = location.state?.trip_type || null; // We will use this for fetching prior booking window and for searching trips, but it is not required to be present in the navigation state because we can still allow the user to book without enforcing the prior booking window constraint if trip_type is not available for some reason. If trip_type is not available, we will just skip fetching prior booking window and not enforce that constraint, rather than blocking the entire flow.

  // Fetch prior booking window (hours)
  const { data: priorBookingWindow, isLoading: priorBookingWindowLoading } =
    useTripPriorBookingWindowQuery(trip_type, state_code);

  // Fetch outstation constraints like min_allowed_days, max_allowed_days, max_allowed_hops etc.
  const {
    data: outstationConstraints,
    isLoading: outstationConstraintsLoading,
    isError: outstationConstraintsError,
  } = useTripTypeConstraintsQuery(trip_type, state_code);

  const minTripDays = Number(outstationConstraints?.min_trip_days);
  const maxTripDays = Number(outstationConstraints?.max_trip_days);
  const maxHops = Number(outstationConstraints?.max_hops);
  const isRoundTripOnly = Boolean(outstationConstraints?.round_trip_only);
  const hasValidTripDayConstraints =
    Number.isFinite(minTripDays) &&
    Number.isFinite(maxTripDays) &&
    minTripDays > 0 &&
    maxTripDays >= minTripDays;
  const hasValidHopConstraints = Number.isInteger(maxHops) && maxHops >= 0;

  // Validation: startDate must be at least [priorBookingWindow] hours from now
  const earliestBookingStartDate = useMemo(() => {
    // Minimum start date is current time + prior booking window hours. If priorBookingWindow is not available, we won't enforce this constraint (we will set it to default 3 hours).
    // This means that, a customer can only book a rental starting at least [priorBookingWindow] hours in the future from now. For example, if priorBookingWindow is 3, and current time is 3 PM, then the earliest start time they can select is 6 PM onwards.
    // We do not throw error if priorBookingWindow is not available, because we want to allow booking without this constraint rather than blocking the entire flow. Instead, we will just use a default value for calculating earliestBookingStartDate, but we won't show any error to user about missing priorBookingWindow.
    const bookingWindow = priorBookingWindow || DEFAULT_MINIMUM_BOOKING_HOURS;
    const now = new Date();
    now.setHours(now.getHours() + bookingWindow);
    return now;
  }, [priorBookingWindow]);

  // State for form fields
  const [startDate, setStartDate] = useState(null); // ISO string
  const [endDate, setEndDate] = useState(null); // ISO string, required for outstation trips
  const [hops, setHops] = useState([]);
  const [ridePreferences, setRidePreferences] = useState({
    num_adults: 1,
    num_children: 0,
    num_large_suitcases: 0,
    num_carryons: 0,
    num_backpacks: 0,
    num_other_bags: 0,
  }); // Example additional preferences

  const [inProgress, setInProgress] = useState(false);
  const [searchResults, setSearchResults] = useState(null); // Store search results to pass to next page
  const { includedServices } = useOutstationServices(searchResults?.metadata);

  const earliestReturnDate = useMemo(() => {
    if (!startDate?.isoString || !hasValidTripDayConstraints) return null;
    return addDays(new Date(startDate.isoString), minTripDays);
  }, [hasValidTripDayConstraints, minTripDays, startDate]);

  const latestReturnDate = useMemo(() => {
    if (!startDate?.isoString || !hasValidTripDayConstraints) return null;
    return addDays(new Date(startDate.isoString), maxTripDays);
  }, [hasValidTripDayConstraints, maxTripDays, startDate]);

  useLayoutEffect(() => {
    if (!searchResults) return;

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [searchResults]);

  const handleRideOptionSearch = async () => {
    if (inProgress) return; // Prevent multiple submissions
    try {
      setInProgress(true);
      if (!origin) {
        showToast("Please choose where your trip starts.", "error", {
          position: "top-center",
        });
        return;
      }

      if (!dropOff) {
        showToast("Please choose your outstation destination.", "error", {
          position: "top-center",
        });
        return;
      }

      if (!startDate) {
        showToast("Please choose when you want to leave.", "error", {
          position: "top-center",
        });
        return;
      }

      if (!endDate) {
        showToast("Please choose when you want to return.", "error", {
          position: "top-center",
        });
        return;
      }

      if (!hasValidTripDayConstraints) {
        showToast(
          "We couldn't load the available trip durations. Please try again.",
          "error",
          { position: "top-center" },
        );
        return;
      }

      // We won't error out if hop constraints are not available, because we want to allow booking without this constraint rather than blocking the entire flow. Instead, we will just skip validating hops if hop constraints are not available.
      if (!hasValidHopConstraints) {
        // maxHops is not available or invalid
        if (isDevMode) {
          console.warn(
            "Hop constraints are unavailable right now. Skipping hop validation.",
          );
        }
      }

      if (hasValidHopConstraints && hops.length > maxHops) {
        showToast(
          `You can add up to ${maxHops} stops for this trip.`,
          "error",
          {
            position: "top-center",
          },
        );
        return;
      }

      if (
        earliestBookingStartDate &&
        new Date(startDate.isoString) < earliestBookingStartDate
      ) {
        const minimumBookingHours =
          priorBookingWindow || DEFAULT_MINIMUM_BOOKING_HOURS;
        showToast(
          `Please choose a departure time at least ${minimumBookingHours} hours from now.`,
          "error",
          { position: "top-center" },
        );
        return;
      }

      const selectedReturnDate = new Date(endDate.isoString);
      if (selectedReturnDate < earliestReturnDate) {
        showToast(
          `Please choose a return time at least ${minTripDays} days after departure.`,
          "error",
          { position: "top-center" },
        );
        return;
      }

      if (selectedReturnDate > latestReturnDate) {
        showToast(
          `Please choose a return time within ${maxTripDays} days of departure.`,
          "error",
          { position: "top-center" },
        );
        return;
      }

      const overlayProps = {
        message: "Getting the best rides for you...",
        illustration: (
          <GettingRideOptionsIllustration className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64" />
        ),
        subtext:
          "Checking round-trip options matched to your route and travel dates.",
      };

      showOverlay(overlayProps);
      const payload = {
        trip_type,
        origin,
        destination: dropOff || null, // Optional, some rentals may not have fixed destination
        start_date: startDate.isoString,
        end_date: endDate.isoString,
        ...(hops.length > 0 ? { hops } : {}),
        ...ridePreferences,

        timezone: client_timezone.timezone,
        utc_offset: client_timezone.utc_offset_minutes,
      };
      if (isDevMode) {
        console.log("Searching trips with payload:", payload);
      }

      const response = await searchTrips.mutateAsync(payload);
      if (isDevMode) {
        console.log("Search response:", response);
      }
      const data = response.data;
      // In each option, we will have calculated per minute and per km rates based on included hours/kms and total price, so we don't need to calculate it again in the TripOptionCard. We will just pass these values down to TripOptionCard to display to user.
      const enrichedOptions = enrichOptionsWithRates(data?.options || []);
      data.options = enrichedOptions;

      setSearchResults(data); // Store search results to pass to next page
      hideOverlay();
    } catch (e) {
      hideOverlay();
      if (isDevMode) {
        console.error("Error during booking:", e);
      }
      const msg = "An unexpected error occurred. Please try again.";
      showToast(msg, "error", { position: "top-center" });
    } finally {
      setInProgress(false);
    }
  };

  const handleBook = (option) => {
    setInProgress(true);
    
    const payload = {
      option,
      preferences: searchResults?.preferences || {},
      metadata: searchResults?.metadata || {},
      disclaimers: searchResults?.disclaimers || [],
      refunds_and_cancellation_policies:
        searchResults?.refund_and_cancellation_policy || [],
      trip_type,
    };

    
    
    // 
    
    navigate(ROUTES.BOOKING, { state: { bookingPayload: payload } });
    setInProgress(false);
  };

  const fetchedStartDate = {
    isoString:
      searchResults?.preferences?.start_date || startDate?.isoString || null,
  };
  const fetchedEndDate = {
    isoString:
      searchResults?.preferences?.end_date || endDate?.isoString || null,
  };

  const fetchedTimezone =
    searchResults?.preferences?.timezone ||
    client_timezone?.timezone ||
    DEFAULT_USER_TIMEZONE;
  const fetchedHops = searchResults?.preferences?.hops || hops;
  const totalTripDays = searchResults?.metadata?.total_trip_days || null;
  const includedKms = searchResults?.metadata?.included_kms || null;
  if (searchResults) {
    return (
      <div
        className={`relative
          xl:w-3/4 min-h-screen overflow-y-auto scrollbar-hide
          bg-gray-50 sm:bg-white
          px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10
          py-2 xs:py-3 sm:py-6 md:py-8 lg:py-10
          mx-auto
          overflow-visible
          sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-screen-2xl
          sm:rounded-xl sm:shadow-lg
          shadow-[0_2px_16px_0_rgba(16,30,54,0.08)] max-w-full mb-4 ${inProgress ? "pointer-events-none opacity-70" : ""}`}
      >
        <div className="relative z-10 animate-slide-up duration-300 transition-all">
          {searchResults?.options?.length === 0 && (
            <div className="px-4 mt-4 max-w-2xl mx-auto">
              <NoRidesAvailable
                title="No suitable rides found"
                message="We couldn't find a cab that fits your group and luggage for this trip. Please review your passenger and luggage details, or try a different route or date."
                onRetry={() => setSearchResults(null)}
                retryLabel="Edit search"
                retryClassName="mt-2 px-4 py-2 rounded-lg border border-primary/20 bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 transition cursor-pointer"
              />
              
            </div>
          )}

          
          {searchResults?.options?.length > 0 && (
          <>
          {/* Header: Back Button + Title */}
          <PageHeader
            onBack={() => setSearchResults(null)}
            title={`Available outstation rides`}
            className="px-0 mb-2"
          />

          {/* Trip Itinerary */}
          {searchResults?.options && (
            // Only show trip itinerary if there are search results to display, otherwise user will just see empty page with option to go back and change their search criteria
            <div className="px-4">
              <div className="py-2"></div>

              {/* Route timeline */}
              <RouteTimeline
                pickupLocation={origin}
                dropoffLocation={dropOff}
                hops={fetchedHops}
                showReturn
                className="mb-4"
              />
              {isRoundTripOnly && <RoundTripOnlyDisclaimer />}

              {/* Pick up date/time in readable format, like Friday, June 14, 2024, 3:00 PM */}
              <RideTimings
                startDatetime={fetchedStartDate}
                endDatetime={fetchedEndDate}
                pickupLabel="Departure"
                dropoffLabel="Return"
                className=" mt-4 mb-4"
                timezone={fetchedTimezone}
              />
              {totalTripDays && totalTripDays > 0 && (
                <OutstationPackage
                  totalTripDays={totalTripDays}
                  includedKms={includedKms}
                />
              )}

              {/* Horizontal divider */}
              <div className="py-1">
                <hr className="border-t border-gray-300" />
              </div>

              {/* Ride add-on for service pills for cost-impacting selections like toll road preference and placard */}
              <IncludedServicePills
                services={includedServices}
                className="mt-3 mb-1"
              />

              {/* Trip options list  */}
              <TripOptionsList
                options={searchResults?.options}
                onSelect={handleBook}
                className=" py-4 mb-4 w-full"
                showRatePerKm
              />

              {/* Trip general disclaimer/terms and conditions */}
              {searchResults?.disclaimers &&
                searchResults.options?.length > 0 &&
                // Only show disclaimers if there are search results to display, otherwise user will just see empty page with option to go back and change their search criteria
                Array.isArray(searchResults.disclaimers) && (
                  <TripDisclaimer
                    disclaimers={searchResults.disclaimers}
                    className=" mt-4 mb-4"
                  />
                )}
            </div>
          )}
          </>
          )}
        </div>
      </div>
    );
  } else {
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
          ${inProgress ? "pointer-events-none opacity-70" : ""}
        `}
      >
        <div className="relative z-10">
          {/* Header: Back Button + Title */}

          <PageHeader
            onBack={() => navigate(-1)}
            title="Plan your outstation trip"
            className="px-0 mb-4"
          />

          <div className="px-4">
            {/* Route timeline */}
            <RouteTimeline
              pickupLocation={origin}
              dropoffLocation={dropOff}
              hops={hops}
              showReturn
            />

            {isRoundTripOnly && <RoundTripOnlyDisclaimer />}

            {/* Hop manager */}
            {/* Show only if constraints are loaded from server - otherwise - hop feature will not work and that is fine. We need not show any error message intermittently while constraints are loading to avoid bad UX*/}
            {!outstationConstraintsError && hasValidHopConstraints && (
              <OutstationHopManager
                value={hops}
                onChange={setHops}
                maxHops={maxHops}
                origin={origin}
                destination={dropOff}
                coordinates={{ lat: origin.lat, lng: origin.lng }}
                disabled={outstationConstraintsLoading || inProgress}
                collapseCommittedStops
                className="mb-4"
              />
            )}

            {/* Start date/time picker */}
            <div
              className={`mb-4 ${priorBookingWindowLoading ? "opacity-50 pointer-events-none" : ""}`}
            >
              <label
                htmlFor="startDateTime"
                className="block text-gray-500 text-[13px] md:text-base mb-1"
              >
                When do you want to start your journey?
              </label>

              <InlineDateTimePicker
                id="startDateTime"
                value={startDate}
                earliestStartDate={earliestBookingStartDate}
                onChange={setStartDate}
              />
            </div>

            {/* Return date/time picker */}
            <div
              className={`mb-4 ${
                outstationConstraintsLoading
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            >
              <label
                htmlFor="endDateTime"
                className="mb-1 block text-[13px] text-gray-500 md:text-base"
              >
                When do you want to return back?
              </label>

              {!startDate ? (
                <p className="rounded-md border border-dashed border-gray-300 px-3 py-4 text-sm text-gray-500">
                  Select your departure date first.
                </p>
              ) : (
                !outstationConstraintsError &&
                hasValidTripDayConstraints && (
                  <>
                    <p className="mb-2 text-sm text-gray-400">
                      You can choose a return time between {minTripDays} and{" "}
                      {maxTripDays} days after departure.
                    </p>
                    <InlineDateTimePicker
                      id="endDateTime"
                      value={endDate}
                      earliestStartDate={earliestReturnDate}
                      latestStartDate={latestReturnDate}
                      onChange={setEndDate}
                    />
                  </>
                )
              )}
            </div>

            {/* Optional: Preferences like num_adults, children and luggage */}
            <div className="mb-16 xl:mb-4">
              <label
                htmlFor="ridePreferences"
                className="block text-gray-500 text-[13px] md:text-base mb-2"
              >
                Preferences
              </label>
              <RideMetaDataPreferences
                value={ridePreferences}
                onChange={setRidePreferences}
                id="ridePreferences"
                tripType={trip_type}
                showLuggage
                helperText="Add passengers and luggage so we can suggest a cab with optimal seating and boot space."
              />
            </div>

            {/* Ambient illustration - city background to enhance visual appeal */}
            <OutstationRoutePlanningIllustration className="flex justify-center w-full max-w-xs sm:max-w-sm object-contain pointer-events-none select-none opacity-20 mt-8 mb-24 lg:hidden" />
            {/* Book button - sticky up to xl, inside main content */}
            <div className="xl:sticky fixed left-0 right-0 bottom-0 z-20 bg-gray-50 sm:bg-white xl:bg-transparent px-2 xs:px-3 xl:px-0 pb-2 pt-2 xl:pt-0 xl:pb-0 border-t border-gray-200 xl:border-0 shadow-[0_-2px_16px_0_rgba(16,30,54,0.04)] max-w-full mx-auto ">
              <button
                className="w-full cursor-pointer bg-primary text-white py-3 rounded font-semibold disabled:opacity-50 text-base shadow-sm"
                onClick={handleRideOptionSearch}
                disabled={
                  !origin ||
                  !startDate ||
                  !endDate ||
                  !hasValidTripDayConstraints ||
                  !hasValidHopConstraints ||
                  outstationConstraintsLoading ||
                  outstationConstraintsError ||
                  inProgress
                }
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
          </div>
        </div>
      </div>
    );
  }
}

export { Outstation };
