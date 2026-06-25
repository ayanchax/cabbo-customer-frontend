import React from "react";
import { TRIP_OCCURENCE_LABELS } from "@/utils";
import { TripFeed } from "./components/TripFeed";

function Ongoing() {
  return <TripFeed bucket={TRIP_OCCURENCE_LABELS.ONGOING} />;
}

export { Ongoing };
