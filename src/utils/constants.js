export const APP = {
    name: "Cabbo",
    tagline: "Your ride, simplified"
}
export const LOCAL_STORAGE_KEYS = {
    "token": "token",
    "currentLocation": "currentLocation",
    "recentSuggestions": "recentSuggestions",
    "clientGeography": "clientGeography",
    "serverGeography": "serverGeography",
}
export const API_VERSION = import.meta.env.VITE_API_VERSION || "/api/v1";

export const ENDPOINTS = {
    AUTH: {
        INITIATE_ONBOARDING: `${API_VERSION}/auth/onboard/initiate`,
        VERIFY_ONBOARDING_WITH_OTP: `${API_VERSION}/auth/onboard/verify`,
        ONBOARD_AND_LOGIN: `${API_VERSION}/auth/onboard`,
        INITIATE_LOGIN: `${API_VERSION}/auth/login/initiate`,
        LOGIN_WITH_OTP: `${API_VERSION}/auth/login`,
        RESEND_OTP: `${API_VERSION}/auth/resend-otp`,
    },
    GEOGRAPHY: {
        SERVER: `${API_VERSION}/geography`,
        CLIENT: `${import.meta.env.VITE_CLIENT_GEOLOCATION_API_URL || "https://ipapi.co/json/"}`
    },
    LOCATION: {
        SEARCH: `${API_VERSION}/locations/search`,
        REVERSE_GEOCODE: `${API_VERSION}/locations/reverse-geocode`,
        LOCATION_BY_PLACE_ID: `${API_VERSION}/locations/place-details`,
    },
    CUSTOMER: {
        IS_LOGGED_IN: `${API_VERSION}/customer/profile/is-logged-in`,
        PROFILE: `${API_VERSION}/customer/profile`,
        
    },
    TRIP: {
            CLASSIFY_TYPE: `${API_VERSION}/trips/trip-type-classification/classify`,
        }


}

export const ROUTES = {
    LOGIN: "/login",
    VERIFY: "/verify",
    ONBOARD: "/onboard",
    HOME: "/",
    TRIPS: "/trips",
    PROFILE: "/profile",
    LOCAL: "/local-hourly-rental",
    OUTSTATION: "/outstation",
    AIRPORT: "/airport-transfers",
};

export const TRIP_TYPES =
{
    AIRPORT_PICKUP: "airport_pickup", // pickup from airport to any drop location, also known as airport transfers
    AIRPORT_DROPOFF: "airport_drop", // drop to airport from any pickup location, also known airport transfers
    OUTSTATION: "outstation", // long-distance multi day trips outside the city, also known as outstation or inter-city rides   
    LOCAL: "local", // short-distance same day trips within the city, also known as point-to-point or intra-city rides or hourly rentals
}