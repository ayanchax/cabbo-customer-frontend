import { api } from "@/api";
import { ENDPOINTS } from "@/utils";
export const isLoggedIn = async () => {

    const { data } = await api.get(ENDPOINTS.CUSTOMER.IS_LOGGED_IN);
    return data;
}