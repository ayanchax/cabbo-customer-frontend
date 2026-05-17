import { useQuery } from "@tanstack/react-query";
import { fetchServerGeography, fetchClientGeography } from "@/api";

export const useGeographyQuery = () => {
    const fallbackGeography = {
        country_name: "India",
        country_code: "IN",
        phone_code: "+91",
        flag: "🇮🇳",
        currency: "INR",
        currency_symbol: "₹",
        currency_decimal_places: 2,
        currency_in_words: "Rupees",
        currency_international_name: "Indian Rupee",
    };

    // Fetch client-side geography (from ipapi)
    // NOTE: We use ipapi (IP-based geolocation) for client geography in this hook to determine broad, non-critical details
    // such as country code, currency, and locale-specific units. This is used for platform-level display (e.g., currency symbol, country code)
    // and is NOT used for features requiring precise user location (like pickup/dropoff or address search).
    // For accurate user location, we use the browser's native geolocation API (with permission) [elsewhere] in the app.
    // This separation ensures we show correct country-specific details without sacrificing privacy or accuracy for location-critical features.

    const { data: clientData, error: clientError } = useQuery({
        queryKey: ["clientGeography"],
        queryFn: fetchClientGeography,
        staleTime: Infinity,
        cacheTime: Infinity,
        retry: false,
    });

    // Fetch server-side geography.
    const { data: serverData, isLoading, error } = useQuery({
        queryKey: ["geography"],
        queryFn: fetchServerGeography,
        staleTime: Infinity,
        cacheTime: Infinity,
        retry: false,
    });

    // Use ipapi country_code if available, else fallback
    const clientCountryCode = clientData?.country_code?.toUpperCase() || fallbackGeography.country_code;
    const clientCountryName = clientData?.country_name || fallbackGeography.country_name;

    // Compose client geography object
    const clientGeography =
        (!clientError && clientData && clientData.country_code)
            ? {
                ...fallbackGeography,
                ...clientData,
                country_code: clientCountryCode,
                country_name: clientCountryName,
            }
            : fallbackGeography;

    // Compose server geography object
    const serverGeography = (!error && serverData && serverData.country_code)
        ? serverData
        : fallbackGeography;

    // Mismatch if country_code differs
    const isMismatch = serverGeography.country_code !== clientGeography.country_code;

    return {
        clientGeographyData: clientGeography,
        serverGeographyData: serverGeography,
        serverGeographyLoading: isLoading,
        serverGeographyError: error,
        clientGeographyCode: clientCountryCode,
        fallbackGeography,
        isMismatch,
        clientGeographyError: clientError,
    };
};