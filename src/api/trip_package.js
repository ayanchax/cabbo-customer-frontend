import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const getTripPackages = async (trip_type, region_code) => {
    const { data } = await api.get(`${ENDPOINTS.TRIP.GET_PACKAGES_BY_TRIP_TYPE_AND_REGION}/${trip_type}/${region_code}`);
    return data;
};

export const getTripPriorBookingWindow = async (trip_type, jurisdiction_code) => {
    const { data } = await api.get(`${ENDPOINTS.TRIP.GET_PRIOR_BOOKING_WINDOW}/${trip_type}/${jurisdiction_code}`);
    return data;
}

export const getTripTypeConstraints = async (trip_type, jurisdiction_code) => {
    const { data } = await api.get(`${ENDPOINTS.TRIP.GET_TRIP_TYPE_CONSTRAINTS}/${trip_type}/${jurisdiction_code}`);
    return data;
}