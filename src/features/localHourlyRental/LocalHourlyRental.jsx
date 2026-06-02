import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useTripPackagesQuery,
  useTripPriorBookingWindowQuery,
  useToast,
  useTimezone,
  useOverlay,
} from "@/hooks";
import {
  InlineDateTimePicker,
  GettingRideOptionsIllustration,
  RideMetaDataPreferences,
  TripOptionsList,
  RideTimings,
  PersonBoardingCabIllustration,
  RouteTimeline,
  PageHeader,
  TripDisclaimer,
} from "@/components";
import {
  PackageCards,
  SelectedPackage,
} from "@/features/localHourlyRental/components";
import { useLocalTripSearch } from "@/features/localHourlyRental/hooks";
import {} from "@/components";
import { isDevMode } from "@/api";
import { Info } from "lucide-react";
import {ROUTES, enrichOptionsWithRates, DEFAULT_USER_TIMEZONE} from "@/utils";

const DEFAULT_MINIMUM_BOOKING_HOURS = 6; // Default to 6 hours if API doesn't provide a value
function LocalHourlyRental() {
  const location = useLocation();
  const { timezone: client_timezone } = useTimezone();
  const { showOverlay, hideOverlay } = useOverlay();
  const searchTrips = useLocalTripSearch();
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
  const [ridePreferences, setRidePreferences] = useState({
    num_adults: 1,
    num_children: 0,
  }); // Example additional preferences
  const [inProgress, setInProgress] = useState(false);
  const [searchResults, setSearchResults] = useState(null); // Store search results to pass to next page
  const selectedPackage = useMemo(() => {
    return packages?.find((pkg) => pkg.id === selectedPackageId);
  }, [packages, selectedPackageId]);

  

  const handleRideOptionSearch = async () => {
    if (inProgress) return; // Prevent multiple submissions
    try {
      setInProgress(true);
      if (!origin) {
        const msg =
          "Pickup location is required to book a local hourly rental.";
        showToast(msg, "error", { position: "top-center" });

        return;
      }
      if (!startDate) {
        const msg = "Please select a start date and time.";
        showToast(msg, "error", { position: "top-center" });
        return;
      }
      if (!selectedPackageId) {
        const msg = "Please select a package.";
        showToast(msg, "error", { position: "top-center" });
        return;
      }
      if (
        earliestRentalStartDate &&
        new Date(startDate) < earliestRentalStartDate
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
      showOverlay(overlayProps);
      const payload = {
        trip_type,
        origin,
        destination: dropOff || null, // Optional, some rentals may not have fixed destination
        start_date: startDate.isoString,
        ...ridePreferences,
        package_id: selectedPackageId,
        timezone: client_timezone.timezone,
        utc_offset: client_timezone.utc_offset_minutes,
      };
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
     const payload ={
      option,
      preferences: searchResults?.preferences || {},
      metadata: searchResults?.metadata || {},
      disclaimers: searchResults?.disclaimers || [],
      refunds_and_cancellation_policies:searchResults?.refund_and_cancellation_policy || [],
      selectedPackage,
      trip_type
    }
     navigate(ROUTES.BOOKING, { state: { bookingPayload: payload } });
     setInProgress(false);
    }
  
  const fetchedStartDate = { isoString: searchResults?.preferences?.start_date || startDate || null };
  
  const fetchedTimezone = client_timezone?.timezone || searchResults?.preferences?.timezone || DEFAULT_USER_TIMEZONE;

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
            title="Available hourly rental rides"
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
              {/* Selected package */}
              {selectedPackage && (
                <SelectedPackage
                  selectedPackage={selectedPackage}
                  className=" mt-2 md:mb-4"
                />
              )}
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
          {/* Suggestions:
            Book an Hourly Rental
            Start Your Hourly Ride
            Schedule Your Local Rental
            Hourly Rental Booking
            */}
          <PageHeader
            onBack={() => navigate(-1)}
            title="Plan your hourly rental ride"
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
                className="block text-gray-500 text-[13px] md:text-base mb-2"
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
              <label
                htmlFor="package"
                className="block text-gray-500 text-[13px] md:text-base mb-2"
              >
                Select package
              </label>
              <PackageCards
                id="package"
                packages={packages}
                selectedPackageId={selectedPackageId}
                onSelect={setSelectedPackageId}
                loading={packagesLoading}
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
              />
            </div>

            {/* Ambient illustration - city background to enhance visual appeal */}
            <PersonBoardingCabIllustration className="flex justify-center w-full max-w-xs sm:max-w-sm object-contain pointer-events-none select-none opacity-20 mt-8 mb-24 lg:hidden" />

            {/* Book button - sticky up to xl, inside main content */}
            <div className="xl:sticky fixed left-0 right-0 bottom-0 z-20 bg-gray-50 sm:bg-white xl:bg-transparent px-2 xs:px-3 xl:px-0 pb-2 pt-2 xl:pt-0 xl:pb-0 border-t border-gray-200 xl:border-0 shadow-[0_-2px_16px_0_rgba(16,30,54,0.04)] max-w-full mx-auto ">
              <button
                className="w-full cursor-pointer bg-primary text-white py-3 rounded font-semibold disabled:opacity-50 text-base shadow-sm"
                onClick={handleRideOptionSearch}
                disabled={
                  !origin || !startDate || !selectedPackageId || inProgress
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

export { LocalHourlyRental };
