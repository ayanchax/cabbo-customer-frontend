import { useQuery } from "@tanstack/react-query";
import { fetchGeography } from "@/api";

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
    }
     

    const { data, isLoading, error } = useQuery({
        queryKey: ["geography"],
        queryFn: fetchGeography,
        staleTime: Infinity, // never refetch automatically, as geography data is unlikely to change often and we want to minimize API calls
        cacheTime: Infinity, // keep forever
        retry: false, // don't retry on failure, as we have a fallback and we don't want to spam the API if there's an issue
    });

    const clientGeographyCode = () => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().locale.split("-")[1] || fallbackGeography.country_code;

        }
        catch {
            return fallbackGeography.country_code;
        }

    }

    const _serverGeographyData = () => {
        try {
            if (error || !data || !data.country_code) {
                return fallbackGeography;
            }
            return data || fallbackGeography;
        }
        catch {
            return fallbackGeography;
        }
    };

    const serverGeographyData = _serverGeographyData();

    const isClientGeographyMismatchedWithServerGeography = serverGeographyData.country_code !== clientGeographyCode();

    const _clientGeographyData = () => {
        if (isClientGeographyMismatchedWithServerGeography) {
            // If there's a mismatch, we can choose to trust the client's geography for certain use cases (like displaying the flag or currency symbol), while still using server geography for other use cases (like determining available services). This is a design decision and can be adjusted based on specific requirements.
            return {
                ...fallbackGeography,
                country_code: clientGeographyCode(),

            }
        }
        // If there's no mismatch, we can simply return the server geography data, which is likely more accurate for backend-related decisions.
        return serverGeographyData;

    }
    const clientGeographyData = _clientGeographyData();

    return {clientGeographyData, serverGeographyData, serverGeographyLoading: isLoading, serverGeographyError: error, clientGeographyCode, fallbackGeography, isMismatch: isClientGeographyMismatchedWithServerGeography };
};