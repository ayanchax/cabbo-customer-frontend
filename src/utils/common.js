export const isPhoneNumberValid = (phone) => {
    // Basic validation: check if it's 10 digits and only contains numbers
    // Phone numbers are generally 10 digits long (without country code) in most countries, including India, plus this is again checked in backend per country rules, so we can show a generic error message for all countries.
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}

export const sanitizePhoneNumber = (input, countryCode) => {
  if (!input) return "";

  let phone = input.trim();

  // Remove spaces, dashes, etc
  phone = phone.replace(/\D/g, "");

  // Remove leading zeros
  phone = phone.replace(/^0+/, "");

  // Remove country code if user typed it
  const numericCountryCode = countryCode ? countryCode.replace("+", "") : "";
  
  // If the phone number starts with the country code, remove it
  if (
    phone.length > 10 &&
    phone.startsWith(numericCountryCode)
  ) {
    phone = phone.slice(numericCountryCode.length);
  }

  return phone;
};