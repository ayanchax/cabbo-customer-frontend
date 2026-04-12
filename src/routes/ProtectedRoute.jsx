import { Navigate, Outlet } from "react-router-dom";
import { routes } from "@/routes";
import { useLocalStorage, useCustomer } from "@/hooks";
import { LOCAL_STORAGE_KEYS } from "@/utils";
import { Splash } from "@/components";

const ProtectedRoute = () => {
  const { getItem } = useLocalStorage();
  const {
    isCustomerLoggedIn,
    isCustomerLoggedInStatusLoading,
    isCustomerLoggedInStatusError,
  } = useCustomer();
  const token = getItem(LOCAL_STORAGE_KEYS.token);

  // checking session
  if (isCustomerLoggedInStatusLoading) {
    return <Splash />;
  }
  // ❌ No token OR invalid session
  if (!token || isCustomerLoggedInStatusError || isCustomerLoggedIn === false) {
    return <Navigate to={routes.login} replace />;
  }

  // ✅ Valid session, allow access to protected pages
  return <Outlet />;
};

export default ProtectedRoute;
