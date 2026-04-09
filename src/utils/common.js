export const isPhoneNumberValid = (phone) => {
    // Basic validation: check if it's 10 digits and only contains numbers
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}