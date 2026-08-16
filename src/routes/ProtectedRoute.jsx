import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/utils";
import { useIsLoggedInQuery } from "@/hooks";
import { Splash } from "@/components";
import { CustomerProvider } from "@/context";

const ProtectedRoute = () => {
  const { 
    data:isCustomerLoggedIn, 
    isLoading:isCustomerLoggedInStatusLoading, 
    error:isCustomerLoggedInStatusError 
  } = useIsLoggedInQuery();

  // checking session
  if (isCustomerLoggedInStatusLoading) {
    return <Splash message='Loading your experience...' />;
  }
  // Missing or invalid backend session
  if (isCustomerLoggedInStatusError || isCustomerLoggedIn === false) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Valid session, allow access to protected pages
  return <CustomerProvider isLoggedIn={isCustomerLoggedIn}>{<Outlet />}</CustomerProvider>;
};

export default ProtectedRoute;
