export const APP={
    name:"Cabbo",
    tagline:"Your ride, simplified"
}
export const LOCAL_STORAGE_KEYS = {
    "token": "token",
}
export const API_VERSION = import.meta.env.VITE_API_VERSION || "/api/v1";

export const ENDPOINTS={
    AUTH:{
        INITIATE_ONBOARDING: `${API_VERSION}/auth/onboard/initiate`,
        VERIFY_ONBOARDING_WITH_OTP: `${API_VERSION}/auth/onboard/verify`,
        INITIATE_LOGIN: `${API_VERSION}/auth/login/initiate`,
        LOGIN_WITH_OTP: `${API_VERSION}/auth/login`,
        RESEND_OTP: `${API_VERSION}/auth/resend-otp`,
    },
    GEOGRAPHY: `${API_VERSION}/geography`,
}
