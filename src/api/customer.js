import { api } from "@/api";
import { ENDPOINTS } from "@/utils";
export const isLoggedIn = async () => {

    const { data } = await api.get(ENDPOINTS.CUSTOMER.IS_LOGGED_IN);
    return data;
}

export const getProfile = async () => {
    const { data } = await api.get(ENDPOINTS.CUSTOMER.PROFILE);
    return data;
}

export const logoutCustomer = async () => {
    const { data } = await api.post(ENDPOINTS.CUSTOMER.LOGOUT);
    return data;
}

export const updateCustomerName = async (name) => {
    const { data } = await api.patch(ENDPOINTS.CUSTOMER.UPDATE_NAME, { name });
    return data;
}

export const updateCustomerEmail = async (email) => {
    const { data } = await api.patch(ENDPOINTS.CUSTOMER.UPDATE_EMAIL, { email });
    return data;
}

export const reinitiateCustomerEmailVerification = async () => {
    const { data } = await api.post(ENDPOINTS.CUSTOMER.REINITIATE_EMAIL_VERIFICATION);
    return data;
}

export const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post(ENDPOINTS.CUSTOMER.UPLOAD_PROFILE_PICTURE, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export const removeProfilePicture = async () => {
    const { data } = await api.delete(ENDPOINTS.CUSTOMER.REMOVE_PROFILE_PICTURE);
    return data;
}
