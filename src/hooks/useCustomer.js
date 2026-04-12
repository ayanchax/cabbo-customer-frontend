import { useIsLoggedInQuery } from "@/hooks";
const useCustomer = () => {
    const { data: isCustomerLoggedIn, isLoading: isCustomerLoggedInStatusLoading, error: isCustomerLoggedInStatusError } = useIsLoggedInQuery();

    return { isCustomerLoggedIn, isCustomerLoggedInStatusLoading, isCustomerLoggedInStatusError };

}

export { useCustomer }