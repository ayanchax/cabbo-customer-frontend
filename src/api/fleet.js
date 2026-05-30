import { api } from "@/api";
import { ENDPOINTS } from "@/utils";


export const getFleet = async () => {
    const { data } = await api.get(ENDPOINTS.FLEET.GET_AVAILABLE_CABS);
    return data;
}