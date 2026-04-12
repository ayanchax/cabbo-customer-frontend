import { Navigate, Outlet } from "react-router-dom";
import { routes } from "@/routes";
import { useLocalStorage, useCustomer } from "@/hooks";
import { LOCAL_STORAGE_KEYS } from "@/utils";

const PublicRoute = () => {
  const { getItem } = useLocalStorage();
  const { 
    isCustomerLoggedIn, 
    isCustomerLoggedInStatusLoading, 
    isCustomerLoggedInStatusError 
  } = useCustomer();

  const token = getItem(LOCAL_STORAGE_KEYS.token);

  // checking session
  if (isCustomerLoggedInStatusLoading) {
    return null;
  }

  // If already logged in → redirect to home
  if (token && !isCustomerLoggedInStatusError && isCustomerLoggedIn) {
    return <Navigate to={routes.home} replace />;
  }

  // Otherwise allow access to public auth pages
  return <Outlet />;
};

export default PublicRoute;