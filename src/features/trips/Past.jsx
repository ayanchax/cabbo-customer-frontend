import React from "react";
import { TRIP_OCCURENCE_LABELS } from "@/utils";
import { TripFeed } from "./components/TripFeed";

function Past({ onTotalTripsChange }) {
  return <TripFeed bucket={TRIP_OCCURENCE_LABELS.PAST} onTotalTripsChange={onTotalTripsChange} />;
}

export { Past };
