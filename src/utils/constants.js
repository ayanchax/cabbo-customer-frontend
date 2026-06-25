
export const APP = {
    name: "Cabbo",
    tagline: "Your ride, simplified"
}
export const LOCAL_STORAGE_KEYS = {
    "token": "token",
    "currentLocation": "currentLocation",
    "currentLocationFix": "currentLocationFix",
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
            GET_PACKAGES_BY_TRIP_TYPE_AND_REGION: `${API_VERSION}/trips/trip-packages`, 
            GET_PRIOR_BOOKING_WINDOW: `${API_VERSION}/trips/prior-booking-window`, 
            SEARCH: `${API_VERSION}/trips/search`,
            INITIATE_BOOKING: `${API_VERSION}/trips/initiate-booking`,
            VERIFY_PAYMENT_AND_CONFIRM_TRIP: `${API_VERSION}/trips/confirm-booking`,
            CLEANUP_STAGED_TRIP: `${API_VERSION}/trips/cleanup`,
            GET_BOOKING: `${API_VERSION}/trips/bookings`, // Append booking ID to get details for specific booking
            UPDATE_NON_COST_IMPACTING_TRIP_DETAILS: `${API_VERSION}/trips/bookings`,
            GET_TRIP_TYPE_CONSTRAINTS: `${API_VERSION}/trips/constraints`, 
            MY_TRIPS: `${API_VERSION}/trips/bookings`,
            MY_TRIPS_FEED: `${API_VERSION}/trips/bookings/my/feed`,


        },
    FLEET:{
        GET_AVAILABLE_CABS: `${API_VERSION}/trips/fleet/`,
    }
    


}

export const ROUTES = {
    LOGIN: "/login",
    VERIFY: "/verify",
    ONBOARD: "/onboard",
    HOME: "/",
    MY_TRIPS: "/trips",
    PROFILE: "/profile",
    LOCAL: "/local-hourly-rental",
    OUTSTATION: "/outstation",
    AIRPORT: "/airport-transfers",
    BOOKING: "/booking",
    BOOKING_DETAIL: "/booking/:bookingId",
};

export const TRIP_TYPES =
{
    AIRPORT_PICKUP: "airport_pickup", // pickup from airport to any drop location, also known as airport transfers
    AIRPORT_DROPOFF: "airport_drop", // drop to airport from any pickup location, also known airport transfers
    OUTSTATION: "outstation", // long-distance multi day trips outside the city, also known as outstation or inter-city rides   
    LOCAL: "local", // short-distance same day trips within the city, also known as point-to-point or intra-city rides or hourly rentals
}

export const CAB_TYPES={
    HATCHBACK: "Hatchback",
    SEDAN: "Sedan",
    SEDAN_PLUS: "Premium Sedan",
    SUV: "SUV",
    SUV_PLUS: "SUV+"
}

export const CAB_FUEL_TYPES={
    PETROL: "petrol",
    DIESEL: "diesel",
    CNG: "cng",
    ELECTRIC: "electric",
    HYBRID: "hybrid"
}

export const DEFAULT_USER_LOCALE = "en-US";
export const DEFAULT_USER_TIMEZONE = "UTC";
export const DEFAULT_CURRENCY_SYMBOL = "₹";
export const DEFAULT_CURRENCY_CODE= "INR";
export const PAYMENT_ORDER_STATUS={
    CREATED:"created"
}

export const DEFAULT_GEOGRAPHY = {
        country_name: "India",
        country_code: "IN",
        phone_code: "+91",
        flag: "🇮🇳",
        currency: DEFAULT_CURRENCY_CODE,
        currency_symbol: DEFAULT_CURRENCY_SYMBOL,
        currency_decimal_places: 2,
        currency_in_words: "Rupees",
        currency_international_name: "Indian Rupee",
        timezone: "Asia/Kolkata",
        utc_offset: "+05:30",
    };

export const TRIP_STATUS = {
    CONFIRMED: "confirmed",
    ONGOING: "ongoing",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    CLOSED: "closed",
    DISPUTED: "dispute",
}

export const TRIP_OCCURENCE_LABELS={
    UPCOMING: "upcoming",
    ONGOING: "ongoing",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
    PAST: "past",
}

export const SERVER_ERROR_CODES = {
    ALREADY_BOOKED_ON_THIS_SLOT: "ALREADY_BOOKED_ON_THIS_SLOT",
    INVALID_BOOKING_DATA: "INVALID_BOOKING_DATA",
    TRIP_NOT_FOUND: "TRIP_NOT_FOUND",
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

