import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "@/utils";
import { Login, Verify, Onboard } from "@/pages/auth";
import {
  Home,
  LocalHourlyRentalPage,
  AirportTransferPage,
  BookingPage,
  BookingDetailPage,
  OutstationPage,
  MyTripsPage,
  CustomerProfilePage
} from "@/pages";
import { PublicRoute, ProtectedRoute } from "@/routes";

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
          <Route
            path={ROUTES.AIRPORT}
            element={<AirportTransferPage />}
          />
          <Route path={ROUTES.OUTSTATION} element={<OutstationPage />} />
          <Route path={ROUTES.BOOKING} element={<BookingPage />} />
          <Route path={ROUTES.BOOKING_DETAIL} element={<BookingDetailPage />} />
          <Route path={ROUTES.MY_TRIPS} element={<MyTripsPage />} />
          <Route path={ROUTES.PROFILE} element={<CustomerProfilePage />} />
        
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
