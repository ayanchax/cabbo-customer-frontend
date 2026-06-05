import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useTripPriorBookingWindowQuery,
  useToast,
  useTimezone,
  useOverlay,
} from "@/hooks";
import { Route } from "lucide-react";
import {
  InlineDateTimePicker,
  GettingRideOptionsIllustration,
  RideMetaDataPreferences,
  TripOptionsList,
  RideTimings,
  PersonBoardingCabIllustration,
  PersonWaitingAtAirportForPickup,
  CabLeavingFromAirportTerminal,
  RouteTimeline,
  PageHeader,
  TripDisclaimer,
  TogglePreference,
} from "@/components";
import { AirportPickupDetails } from "@/features/airportTransfers/components";
import { useLocalTripSearch } from "@/features/localHourlyRental/hooks";
import { isDevMode } from "@/api";
import {
  ROUTES,
  enrichOptionsWithRates,
  DEFAULT_USER_TIMEZONE,
  TRIP_TYPES,
} from "@/utils";

const DEFAULT_MINIMUM_BOOKING_HOURS = 3; // Default to 3 hours if API doesn't provide a value
function AirportTransfer() {
  const location = useLocation();
  const { timezone: client_timezone } = useTimezone();
  const { showOverlay, hideOverlay } = useOverlay();
  const searchTrips = useLocalTripSearch();
  // Origin is passed in navigation state from previous step
  
  //Origin and drop off are required for airport transfers, but we will do validation and show error if they are not present in the navigation state, rather than blocking the entire flow by making them required in the type definition of the navigation state, because there is a possibility that these values might not be passed correctly from the previous step due to a bug or some unexpected issue, and we don't want to completely block the user from booking an airport transfer in that case. By allowing the flow to continue and showing a user-friendly error message about missing data, we can still allow the user to book an airport transfer by going back and re-selecting their pickup and drop-off locations, rather than forcing them to restart the entire booking process.
  const origin = location.state?.pickup;
  
  const dropOff = location.state?.dropoff; 

  if (!origin) {
    throw new Error(
      "Origin (pickup location) is required to book an airport transfer.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }
  if(!dropOff){
    throw new Error(
      "Drop-off location is required to book an airport transfer.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }

  const { showToast } = useToast();
  const navigate = useNavigate();

  const region_code = origin?.region_code;
  const trip_type = location.state?.trip_type || null; // We will use this for fetching prior booking window and for searching trips, but it is not required to be present in the navigation state because we can still allow the user to book without enforcing the prior booking window constraint if trip_type is not available for some reason. If trip_type is not available, we will just skip fetching prior booking window and not enforce that constraint, rather than blocking the entire flow.
  if (
    [TRIP_TYPES.AIRPORT_PICKUP, TRIP_TYPES.AIRPORT_DROPOFF].indexOf(
      trip_type,
    ) === -1
  ) {
    throw new Error(
      "Invalid or missing trip type in navigation state. Expected airport_pickup or airport_drop.",
    );
    // Error Boundary can catch this and show user-friendly fallback UI with option to go back to previous step
  }

  // Fetch prior booking window (hours)
  const { data: priorBookingWindow, isLoading: priorBookingWindowLoading } =
    useTripPriorBookingWindowQuery(trip_type, region_code);

  // Validation: startDate must be at least [priorBookingWindow] hours from now
  const earliestAirportBookingStartDate = useMemo(() => {
    // Minimum start date is current time + prior booking window hours. If priorBookingWindow is not available, we won't enforce this constraint (we will set it to default 3 hours).
    // This means that, a customer can only book a rental starting at least [priorBookingWindow] hours in the future from now. For example, if priorBookingWindow is 3, and current time is 3 PM, then the earliest start time they can select is 6 PM onwards.
    // We do not throw error if priorBookingWindow is not available, because we want to allow booking without this constraint rather than blocking the entire flow. Instead, we will just use a default value for calculating earliestAirportBookingStartDate, but we won't show any error to user about missing priorBookingWindow.
    const bookingWindow = priorBookingWindow || DEFAULT_MINIMUM_BOOKING_HOURS;
    const now = new Date();
    now.setHours(now.getHours() + bookingWindow);
    return now;
  }, [priorBookingWindow]);

  // State for form fields
  const [startDate, setStartDate] = useState(null); // ISO string
  const [ridePreferences, setRidePreferences] = useState({
    num_adults: 1,
    num_children: 0,
    num_large_suitcases: 0,
    num_carryons: 0,
    num_backpacks: 0,
    num_other_bags: 0,
    toll_road_preferred:
      trip_type === TRIP_TYPES.AIRPORT_DROPOFF ? true : false, // Set default toll road preference based on trip type to return more relevant options based on their preference.
  }); // Example additional preferences
  
  // Preferences specific to airport pickup (optional, only applicable for airport pickup trip type)
  const [airportPickupPreferences, setAirportPickupPreferences] = useState({
    flight_number: null,
    terminal_number: null,
    placard_required: false,
    placard_name: null,
  });
  const [inProgress, setInProgress] = useState(false);
  const [searchResults, setSearchResults] = useState(null); // Store search results to pass to next page

  const getPageHeaderTitle = () => {
    if (trip_type === TRIP_TYPES.AIRPORT_PICKUP) {
      return "Airport pickup";
    } else if (trip_type === TRIP_TYPES.AIRPORT_DROPOFF) {
      return "Airport drop-off";
    } else {
      return "Airport transfer";
    }
  };

  const getPageHeaderInitialSubtitle = () => {
    if (trip_type === TRIP_TYPES.AIRPORT_PICKUP) {
      return "Schedule a ride from the airport to anywhere";
    } else if (trip_type === TRIP_TYPES.AIRPORT_DROPOFF) {
      return "Schedule a ride to the airport from anywhere";
    } else {
      return "Schedule a ride to or from the airport";
    }
  };

  const getPageHeaderSubtitle = () => {
    if (trip_type === TRIP_TYPES.AIRPORT_PICKUP) {
      return "Pre-booked, so no waiting at arrivals";
    } else if (trip_type === TRIP_TYPES.AIRPORT_DROPOFF) {
      return "Pre-booked, so no last-minute rush";
    } else {
      return "Pre-booked rides to or from the airport, so you can relax and skip the hassle";
    }
  };

  const getTollRoadHelperText = () => {
    if (trip_type === TRIP_TYPES.AIRPORT_DROPOFF) {
      return "Helps your driver choose faster routes so you can reach the airport on time. Toll charges may apply.";
    } else {
      return "Helps your driver choose faster routes from the airport when available. Toll charges may apply.";
    }
  };

  const AmbientIllustration = () => {
    if (trip_type === TRIP_TYPES.AIRPORT_PICKUP) {
      return (
        <PersonWaitingAtAirportForPickup className="flex justify-center w-full max-w-xs sm:max-w-sm object-contain pointer-events-none select-none opacity-20 mt-8 mb-24 lg:hidden" />
      );
    } else if (trip_type === TRIP_TYPES.AIRPORT_DROPOFF) {
      return (
        <CabLeavingFromAirportTerminal className="flex justify-center w-full max-w-xs sm:max-w-sm object-contain pointer-events-none select-none opacity-20 mt-8 mb-24 lg:hidden" />
      );
    } else {
      return (
        <PersonBoardingCabIllustration className="flex justify-center w-full max-w-xs sm:max-w-sm object-contain pointer-events-none select-none opacity-20 mt-8 mb-24 lg:hidden" />
      );
    }
  };

  const handleRideOptionSearch = async () => {
    if (inProgress) return; // Prevent multiple submissions
    try {
      setInProgress(true);
      if (!origin) {
        const msg =
          "Pickup location is required to book an airport transfer.";
        showToast(msg, "error", { position: "top-center" });

        return;
      }
      if(!dropOff){
        const msg =
          "Drop-off location is required to book an airport transfer.";
        showToast(msg, "error", { position: "top-center" });
        return;
      }
      if (!startDate) {
        const msg = "Please select a start date and time.";
        showToast(msg, "error", { position: "top-center" });
        return;
      }

      if (
        earliestAirportBookingStartDate &&
        new Date(startDate) < earliestAirportBookingStartDate
      ) {
        const msg = `Start time must be at least ${priorBookingWindow || DEFAULT_MINIMUM_BOOKING_HOURS} hours from now.`;
        showToast(msg, "error", { position: "top-center" });
        return;
      }
      const overlayProps = {
        message: "Getting the best rides for you...",
        illustration: (
          <GettingRideOptionsIllustration className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64" />
        ),
        subtext: "Searching available cabs and packages in your area",
      };
      if(airportPickupPreferences.placard_required && !airportPickupPreferences.placard_name){
        const msg = "Please enter the name to be displayed on the placard.";
        showToast(msg, "error", { position: "top-center" });
        return;
      }
      showOverlay(overlayProps);
      const payload = {
        trip_type,
        origin,
        destination: dropOff || null, // Optional, some rentals may not have fixed destination
        start_date: startDate.isoString,
        ...ridePreferences,
        ...(trip_type === TRIP_TYPES.AIRPORT_PICKUP
          ? airportPickupPreferences
          : {}),
        timezone: client_timezone.timezone,
        utc_offset: client_timezone.utc_offset_minutes,
      };
      console.log("Search payload:", payload);
      return
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
    navigate(ROUTES.BOOKING, { state: { bookingPayload: payload } });
    setInProgress(false);
  };

  const fetchedStartDate = {
    isoString: searchResults?.preferences?.start_date || startDate || null,
  };

  const fetchedTimezone =
    client_timezone?.timezone ||
    searchResults?.preferences?.timezone ||
    DEFAULT_USER_TIMEZONE;

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
          {/* Header: Back Button + Title */}
          <PageHeader
            onBack={() => setSearchResults(null)}
            title={`Available rides ${trip_type === TRIP_TYPES.AIRPORT_DROPOFF ? "to" : "from"} the airport`}
            subtitle={getPageHeaderSubtitle()}
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
                className="mb-4"
              />
              {/* Pick up date/time in readable format, like Friday, June 14, 2024, 3:00 PM */}
              <RideTimings
                startDatetime={fetchedStartDate}
                className=" mt-4 mb-4"
                timezone={fetchedTimezone}
              />

              {/* Horizontal divider */}
              <div className="py-1">
                <hr className="border-t border-gray-300" />
              </div>

              {/* Trip options list  */}
              <TripOptionsList
                options={searchResults?.options}
                onSelect={handleBook}
                className=" py-4 mb-4 w-full"
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
            title={getPageHeaderTitle()}
            subtitle={getPageHeaderInitialSubtitle()}
            className="px-0 mb-4"
          />

          <div className="px-4">
            {/* Route timeline */}
            <RouteTimeline pickupLocation={origin} dropoffLocation={dropOff} />

            {/* Start date/time picker */}
            <div
              className={`mb-4 ${priorBookingWindowLoading ? "opacity-50 pointer-events-none" : ""}`}
            >
              <label
                htmlFor="startDateTime"
                className="block text-gray-500 text-[13px] md:text-base mb-1"
              >
                {trip_type === TRIP_TYPES.AIRPORT_DROPOFF
                  ? "When do you want to leave?"
                  : "When does your flight land?"}
              </label>
              {trip_type === TRIP_TYPES.AIRPORT_PICKUP && (
                <p className="text-sm md:text-sm text-gray-400 mb-2">
                  Your driver will be at arrivals when you land
                </p>
              )}
              <InlineDateTimePicker
                id="startDateTime"
                earliestRentalStartDate={earliestAirportBookingStartDate}
                onConfirm={setStartDate}
              />
            </div>

            {trip_type === TRIP_TYPES.AIRPORT_PICKUP && (
              <div className="mb-4">
                <label
                  htmlFor="airportPickupDetails"
                  className="block text-gray-500 text-[13px] md:text-base mb-2"
                >
                  Arrival details
                </label>
                <AirportPickupDetails
                  id="airportPickupDetails"
                  value={airportPickupPreferences}
                  onChange={setAirportPickupPreferences}
                />
              </div>
            )}

            <div className="mb-4">
              <TogglePreference
                id="tollRoadPreferred"
                title="Prefer toll roads"
                description={getTollRoadHelperText()}
                icon={Route}
                checked={ridePreferences.toll_road_preferred}
                onChange={(checked) =>
                  setRidePreferences((prev) => ({
                    ...prev,
                    toll_road_preferred: checked,
                  }))
                }
              />
            </div>

            {/* Optional: Preferences like num_adults and children */}
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
                helperText="Add passengers and luggage so we can suggest a cab with the right seating and boot space."
              />
            </div>

            {/* Ambient illustration - city background to enhance visual appeal */}
            <AmbientIllustration />
            {/* Book button - sticky up to xl, inside main content */}
            <div className="xl:sticky fixed left-0 right-0 bottom-0 z-20 bg-gray-50 sm:bg-white xl:bg-transparent px-2 xs:px-3 xl:px-0 pb-2 pt-2 xl:pt-0 xl:pb-0 border-t border-gray-200 xl:border-0 shadow-[0_-2px_16px_0_rgba(16,30,54,0.04)] max-w-full mx-auto ">
              <button
                className="w-full cursor-pointer bg-primary text-white py-3 rounded font-semibold disabled:opacity-50 text-base shadow-sm"
                onClick={handleRideOptionSearch}
                disabled={!origin || !startDate || inProgress}
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

export { AirportTransfer };
