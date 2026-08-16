import { useQuery } from "@tanstack/react-query";
import { getTripPackages } from "@/api";

export const useTripPackagesQuery = (trip_type, region_code) => {
    return useQuery({
        queryKey: ["tripPackages", trip_type, region_code],
        queryFn: () => getTripPackages(trip_type, region_code),
        enabled: !!trip_type && !!region_code, // only run if both are provided
        retry: false, // don't retry on failure
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};