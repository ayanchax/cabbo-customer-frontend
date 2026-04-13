import { CustomerContext } from "@/context";
import { useCustomerProfileQuery } from "@/hooks";
import { Splash } from "@/components";
import { ROUTES } from "@/utils";
import { Navigate } from "react-router-dom";

export const CustomerProvider = ({ children, isLoggedIn }) => {
  const { data:customerProfile, isLoading: profileLoading, error: profileError } = useCustomerProfileQuery(!!isLoggedIn);

  if (profileLoading) {
    return <Splash />;
  }

  // If there's an error fetching the profile, it likely means the session is invalid, so we redirect to login
  // Plus the app cannot function without the customer profile, so we treat missing profile as an error case as well
  if (profileError || !customerProfile) {
    // May be we show a fall back error UI here instead of redirecting, but for now let's just redirect to login
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <CustomerContext.Provider
      value={{
        customer: customerProfile || null,
        isLoading: profileLoading,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
