import { useMutation } from "@tanstack/react-query";
import { cleanupStagedTrip } from "@/api";

export const useCleanupStagedTrip = (trip_id) => {
    return useMutation({
        mutationFn: () => cleanupStagedTrip(trip_id),
    });
};