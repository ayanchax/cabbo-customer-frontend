import React, { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { FeedbackState, Loader, TripBookings } from "@/components";
import { useTripBookingsFeed } from "@/hooks";
import { ROUTES, SERVER_ERROR_CODES, TRIP_OCCURENCE_LABELS } from "@/utils";

const EMPTY_COPY = {
  [TRIP_OCCURENCE_LABELS.UPCOMING]: {
    title: "No upcoming trips",
    message: "Your upcoming Cabbo bookings will appear here.",
  },
  [TRIP_OCCURENCE_LABELS.ONGOING]: {
    title: "No ongoing trips",
    message: "Trips in progress will appear here.",
  },
  [TRIP_OCCURENCE_LABELS.PAST]: {
    title: "No past trips",
    message: "Completed, cancelled, and past bookings will appear here.",
  },
};

function TripFeed({ bucket, limit = 10 }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const feedConfig = { bucket, page, limit };
  const { data, isLoading, error, isFetching, refetch } =
    useTripBookingsFeed(feedConfig);

  const errorCode = error?.response?.data?.error_code;
  const statusCode = error?.response?.status;
  const isEmptyTripsResponse =
    statusCode === 404 || errorCode === SERVER_ERROR_CODES.TRIP_NOT_FOUND;
  const emptyFeedData = {
    bucket,
    pagination: {
      page,
      limit,
      total: 0,
      total_pages: 0,
      has_next: false,
      has_previous: false,
    },
    trips: [],
  };

  const feedData = isEmptyTripsResponse ? emptyFeedData : (data ?? null);
  const emptyCopy =
    EMPTY_COPY[bucket] || EMPTY_COPY[TRIP_OCCURENCE_LABELS.UPCOMING];

  const handleSelectBooking = (booking) => {
    if (!booking?.booking_id) return;
    navigate(
      generatePath(ROUTES.BOOKING_DETAIL, {
        bookingId: booking.booking_id,
      }),
    );
  };

  if (isLoading) {
    return <Loader message="Loading trips..." />;
  }

  if (error && !isEmptyTripsResponse) {
    return (
      <FeedbackState
        variant="error"
        title="We couldn't load your trips"
        message="Please check your connection and try again."
        primaryAction={
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            Try again
          </button>
        }
      />
    );
  }

  return (
    <TripBookings
      feedData={feedData}
      onSelectBooking={handleSelectBooking}
      onRefresh={!isEmptyTripsResponse ? refetch : null}
      onNextPage={() => setPage((currentPage) => currentPage + 1)}
      onPreviousPage={() =>
        setPage((currentPage) => Math.max(1, currentPage - 1))
      }
      isRefreshing={isFetching}
      emptyTitle={emptyCopy.title}
      emptyMessage={emptyCopy.message}
    />
  );
}

export { TripFeed };
