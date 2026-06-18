import { useMemo } from "react";
import { Route, IdCard, SquareParking } from "lucide-react";
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
            icon: SquareParking,
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

export const getAirportAddOnServices = (preferences = {}, priceBreakdown = {}) => {
    if (!preferences || typeof preferences !== "object") return [];
    if (!priceBreakdown || typeof priceBreakdown !== "object") return [];
    const services = [];

    if (preferences.toll_road_preferred && priceBreakdown?.toll) {
        services.push("toll");
    }

    if (
        preferences.trip_type === TRIP_TYPES.AIRPORT_PICKUP &&
        preferences.placard_required &&
        priceBreakdown?.placard_charge
    ) {
        services.push("placard_charge");
    }

    return services;
};

const getPageHeaderLabel = (trip_type) => {
      if (trip_type === TRIP_TYPES.AIRPORT_PICKUP) {
        return "Airport pickup";
      } else if (trip_type === TRIP_TYPES.AIRPORT_DROPOFF) {
        return "Airport drop-off";
      } else {
        return "Airport transfer";
      }
    };

export const useAirportTransferServices = (preferences = {}, priceBreakdown = {}) => {

    const includedServices = useMemo(
        () => getAirportIncludedServices(preferences),
        [preferences],
    );

    const addOnServices = useMemo(
        () => getAirportAddOnServices(preferences, priceBreakdown),
        [preferences, priceBreakdown],
    );

    const pageHeaderLabel = useMemo(
        () => getPageHeaderLabel(preferences?.trip_type),
        [preferences?.trip_type],
    );

    return {
        includedServices,
        lockedAddOnKeys: addOnServices,
        pageHeaderLabel,
    };
}
