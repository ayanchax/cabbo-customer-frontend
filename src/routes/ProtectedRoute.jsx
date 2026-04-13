import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/utils";
import { useLocalStorage, useIsLoggedInQuery } from "@/hooks";
import { LOCAL_STORAGE_KEYS } from "@/utils";
import { Splash } from "@/components";
import { CustomerProvider } from "@/context";

const ProtectedRoute = () => {
  const { getItem } = useLocalStorage();
  const { 
    data:isCustomerLoggedIn, 
    isLoading:isCustomerLoggedInStatusLoading, 
    error:isCustomerLoggedInStatusError 
  } = useIsLoggedInQuery();
  const token = getItem(LOCAL_STORAGE_KEYS.token);

  // checking session
  if (isCustomerLoggedInStatusLoading) {
    return <Splash message='Loading your experience...' />;
  }
  // ❌ No token OR invalid session
  if (!token || isCustomerLoggedInStatusError || isCustomerLoggedIn === false) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // ✅ Valid session, allow access to protected pages
  return <CustomerProvider isLoggedIn={isCustomerLoggedIn}>{<Outlet />}</CustomerProvider>;
};

export default ProtectedRoute;
