import { useQuery } from "@tanstack/react-query";
import { getTripTypeConstraints } from "@/api";

export const useTripTypeConstraintsQuery = (trip_type, jurisdiction_code) => {
    return useQuery({
        queryKey: ["tripTypeConstraints", trip_type, jurisdiction_code],
        queryFn: () => getTripTypeConstraints(trip_type, jurisdiction_code),
        enabled: !!trip_type && !!jurisdiction_code, // only run if both are provided
        retry: false, // don't retry on failure
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};