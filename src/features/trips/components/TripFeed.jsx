import React, { useEffect, useRef, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { FeedbackState, Loader, TripBookings } from "@/components";
import { useTripBookingsFeed } from "@/hooks";
import { ROUTES, SERVER_ERROR_CODES, TRIP_OCCURENCE_LABELS } from "@/utils";

const EMPTY_COPY = {
  [TRIP_OCCURENCE_LABELS.UPCOMING]: {
    title: "No upcoming trips",
    message: "Your upcoming bookings will appear here.",
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

function TripFeed({ bucket, limit = 10, onTotalTripsChange }) {
  
  const navigate = useNavigate();
  const feedTopRef = useRef(null);
  const shouldScrollAfterPageLoadRef = useRef(false);
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

  useEffect(() => {
    if (feedData?.pagination?.total !== undefined && onTotalTripsChange) {
      onTotalTripsChange(feedData.pagination.total);
    }
  }, [feedData, onTotalTripsChange]);

  const handleSelectBooking = (booking) => {
    if (!booking?.booking_id) return;
    navigate(
      generatePath(ROUTES.BOOKING_DETAIL, {
        bookingId: booking.booking_id,
      }),
    );
  };

  const scrollToFeedTop = () => {
    feedTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleNextPage = () => {
    shouldScrollAfterPageLoadRef.current = true;
    setPage((currentPage) => currentPage + 1);
  };

  const handlePreviousPage = () => {
    shouldScrollAfterPageLoadRef.current = true;
    setPage((currentPage) => Math.max(1, currentPage - 1));
  };

  useEffect(() => {
    if (isFetching || !shouldScrollAfterPageLoadRef.current || isEmptyTripsResponse) return;
    shouldScrollAfterPageLoadRef.current = false;
    window.requestAnimationFrame(scrollToFeedTop);
  }, [data, isEmptyTripsResponse, isFetching]);

  if (isLoading) {
    return <Loader message={`Loading ${bucket.toLowerCase()} trips...`} />;
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
    <div ref={feedTopRef} className="scroll-mt-24">
      <TripBookings
        feedData={feedData}
        onSelectBooking={handleSelectBooking}
        onRefresh={!isEmptyTripsResponse ? refetch : null}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        isRefreshing={isFetching}
        emptyTitle={emptyCopy.title}
        emptyMessage={emptyCopy.message}
      />
    </div>
  );
}

export { TripFeed };
