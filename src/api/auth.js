import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const initiateOnboarding = (payload) => {
  return api.post(ENDPOINTS.AUTH.INITIATE_ONBOARDING, payload);
}

export const verifyOnboardingOtp = (payload) => {
  return api.post(ENDPOINTS.AUTH.VERIFY_ONBOARDING_WITH_OTP, payload);
}

export const initiateLogin = (payload) => {
  return api.post(ENDPOINTS.AUTH.INITIATE_LOGIN, payload);
};

export const loginWithOtp = (payload) => {
  return api.post(ENDPOINTS.AUTH.LOGIN_WITH_OTP, payload);
};

export const resendOtp = (payload) => {
  return api.post(ENDPOINTS.AUTH.RESEND_OTP, payload);
}