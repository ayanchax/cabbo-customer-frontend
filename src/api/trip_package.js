import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const getTripPackages = async (trip_type, region_code) => {
    const { data } = await api.get(ENDPOINTS.TRIP.GET_PACKAGES_BY_TRIP_TYPE_AND_REGION, {
        params: { trip_type, region_code },
    });
    return data;
};