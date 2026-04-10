import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const initiateOnboarding = (payload) => {
  return api.post(ENDPOINTS.AUTH.INITIATE_ONBOARDING, payload);
}

export const initiateLogin = (payload) => {
  return api.post(ENDPOINTS.AUTH.INITIATE_LOGIN, payload);
};

export const verifyLogin = (payload) => {
  return api.post(ENDPOINTS.AUTH.VERIFY_LOGIN, payload);
};