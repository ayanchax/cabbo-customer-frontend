import React from "react";
import { TRIP_OCCURENCE_LABELS } from "@/utils";
import { TripFeed } from "./components/TripFeed";

function Upcoming({ onTotalTripsChange }) {
  return <TripFeed bucket={TRIP_OCCURENCE_LABELS.UPCOMING} onTotalTripsChange={onTotalTripsChange} />;
}

export { Upcoming };
