import { useMemo } from "react";
import { Route, IdCard, SquareParking  } from "lucide-react";
import { TRIP_TYPES } from "@/utils";

export const getAirportIncludedServices = (preferences = {}) => {
    if (!preferences || typeof preferences !== "object") return [];

    const services = [];

    if (preferences.toll_road_preferred) {
        services.push({
            id: "tolls",
            label: "Tolls",
            icon: Route,
        });
    }

    if (preferences.trip_type === TRIP_TYPES.AIRPORT_PICKUP) {
        services.push({
            id: "parking",
            label: "Parking",
            icon: SquareParking ,
        });
    }

    if (
        preferences.trip_type === TRIP_TYPES.AIRPORT_PICKUP &&
        preferences.placard_required
    ) {
        services.push({
            id: "placard",
            label: "Placard",
            icon: IdCard,
        });
    }

    return services;
};

export const useAirportPickupServices = (preferences = {}) =>
    useMemo(() => getAirportIncludedServices(preferences), [preferences]);
