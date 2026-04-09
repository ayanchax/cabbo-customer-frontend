export const fetchServerCountry = async () => {
  // later: API call
  
  return {
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
};

export const detectUserCountry = async () => {
  try {
    // Later: use backend or Cloudflare header
    // For now simulate
    return Intl.DateTimeFormat().resolvedOptions().locale.split("-")[1] || "IN";
  } catch {
    return "IN";
  }
};