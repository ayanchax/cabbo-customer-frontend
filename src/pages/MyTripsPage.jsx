import React from "react";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import { useTripBookings } from "@/hooks";
import { FeedbackState, Loader, PageHeader, TripBookings } from "@/components";
import { ROUTES } from "@/utils";
import {AppLayout} from "@/layouts";


const VALID_TABS = new Set(["upcoming", "ongoing", "past"]);

function MyTripsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get("tab") || "upcoming";
  const activeTab = VALID_TABS.has(selectedTab) ? selectedTab : "upcoming";

  const { data, isLoading, error, refetch, isFetching } = useTripBookings();
  const bookings = data?.data ?? data ?? {};

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleSelectBooking = (booking) => {
    if (!booking?.booking_id) return;
    navigate(
      generatePath(ROUTES.BOOKING_DETAIL, {
        bookingId: booking.booking_id,
      }),
    );
  };

  if (isLoading) {
    return <Loader message="Loading your trips..." />;
  }

  if (error) {
    return (
      <FeedbackState
        variant="error"
        title="We couldn't load your trips"
        message="Please check your connection and try again."
        primaryAction={
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex cursor-pointer h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            Try again
          </button>
        }
      />
    );
  }

  return (
    <AppLayout>
    <div
      className="relative mx-auto min-h-screen max-w-full overflow-y-auto bg-gray-50 px-2 py-2 shadow-[0_2px_16px_0_rgba(16,30,54,0.08)] sm:max-w-screen-sm sm:rounded-xl sm:bg-white sm:px-4 sm:py-6 sm:shadow-lg md:max-w-3xl md:px-6 md:py-8 lg:max-w-5xl lg:px-8 lg:py-10 xl:mb-4 xl:w-3/4 xl:px-10 2xl:max-w-screen-2xl"
    >
      <div className="px-4">
        <PageHeader title="My trips" className="px-0 mb-3" />
        <TripBookings
          bookings={bookings}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSelectBooking={handleSelectBooking}
          onRefresh={() => refetch()}
          isRefreshing={isFetching}
        />
      </div>
    </div>
    </AppLayout>
  );
}

export default MyTripsPage;
