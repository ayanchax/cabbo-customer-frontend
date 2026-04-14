import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/utils";
import { useLocalStorage, useIsLoggedInQuery } from "@/hooks";
import { LOCAL_STORAGE_KEYS } from "@/utils";
import { Splash } from "@/components";


const PublicRoute = () => {
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

  // If already logged in → redirect to home
  if (token && !isCustomerLoggedInStatusError && isCustomerLoggedIn) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Otherwise allow access to public auth pages
  return <Outlet />;
};

export default PublicRoute;