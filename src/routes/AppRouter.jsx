import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "@/routes";
import { Login, Verify, Onboard } from "@/pages/auth";
import { Home } from "@/pages";
import {PublicRoute, ProtectedRoute } from "@/routes";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          {/* Public auth routes, if user is not logged in, they can access these */}
          <Route path={routes.login} element={<Login />} />
          <Route path={routes.verify} element={<Verify />} />
          <Route path={routes.onboard} element={<Onboard />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          {/* Protected app routes, only accessible if user is logged in */}
          <Route path={routes.home} element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
