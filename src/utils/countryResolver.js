import { COUNTRIES_COLLECTION } from "@/utils";

export const resolveCountry = (serverCountry) => {

    return (
        COUNTRIES_COLLECTION.find(
            (c) => c.country_code.toLowerCase() === serverCountry?.country_code.toLowerCase()
        ) || {
            // Default fallback (India), as Cabbo is an Indian app.
            country_code: "IN",
            country_name: "India",
            phone_code: "+91",
            flag: "🇮🇳",
            currency: "INR",
            currency_symbol: "₹",
            currency_decimal_places: 2,
            currency_in_words: "Rupees",
            currency_international_name: "Indian Rupee",

        }
    );
};