import { useMemo } from "react";
import { FileCheck2, HandCoins } from "lucide-react";
export const getOutstationIncludedServices = (preferences = {}) => {
    if (!preferences || typeof preferences !== "object") return [];

    const services = [];

    if (preferences.is_interstate) {
        services.push({
            id: "permit",
            label: "State permit",
            icon: FileCheck2,
        });
    }

    // Always include Driver allowance for outstation trips, as it is a mandatory service.
    services.push({
        id: "driver_allowance",
        label: "Driver allowance",
        icon: HandCoins,
    });
    return services;
};


export const useOutstationServices = (preferences = {}) => {

    const includedServices = useMemo(
        () => getOutstationIncludedServices(preferences),
        [preferences],
    );

    return {
        includedServices,

    };
}
