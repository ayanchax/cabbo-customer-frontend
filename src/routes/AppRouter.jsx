import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "@/utils";
import { Login, Verify, Onboard } from "@/pages/auth";
import { Home , LocalHourlyRentalPage} from "@/pages";
import {PublicRoute, ProtectedRoute } from "@/routes";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          {/* Public auth routes, if user is not logged in, they can access these */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.VERIFY} element={<Verify />} />
          <Route path={ROUTES.ONBOARD} element={<Onboard />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          {/* Protected app routes, only accessible if user is logged in */}
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOCAL} element={<LocalHourlyRentalPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
