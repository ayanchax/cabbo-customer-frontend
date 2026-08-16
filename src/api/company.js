import { api } from "@/api";
import { ENDPOINTS } from "@/utils";
export const getCompany = async () => {

    const { data } = await api.get(ENDPOINTS.LEGAL.COMPANY);
    return data;
}