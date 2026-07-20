import {lazy, Suspense} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "@/utils";
import { PublicRoute, ProtectedRoute } from "@/routes";
import { Splash } from "@/components";
// Lazy load all routes
const LazyLoadedRoutes = {
  Home: lazy(() => import("@/pages/Home")),
  LocalHourlyRentalPage: lazy(() => import("@/pages/LocalHourlyRentalPage")),
  AirportTransferPage: lazy(() => import("@/pages/AirportTransferPage")),
  BookingPage: lazy(() => import("@/pages/BookingPage")),
  BookingDetailPage: lazy(() => import("@/pages/BookingDetailPage")),
  PaymentPendingConfirmationPage: lazy(() => import("@/pages/PaymentPendingConfirmationPage")),
  OutstationPage: lazy(() => import("@/pages/OutstationPage")),
  MyTripsPage: lazy(() => import("@/pages/MyTripsPage")),
  CustomerProfilePage: lazy(() => import("@/pages/CustomerProfilePage")),
  LegalPage: lazy(() => import("@/pages/LegalPage")),
  Login: lazy(() => import("@/pages/auth/Login")),
  Verify: lazy(() => import("@/pages/auth/Verify")),
  Onboard: lazy(() => import("@/pages/auth/Onboard")),
  VerifyEmail: lazy(() => import("@/pages/VerifyEmailPage"))
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Splash message="Loading Cabbo..." />}>
      <Routes>

        <Route element={<PublicRoute />}>
          {/* Public auth routes, if user is not logged in, they can access these */}
          <Route path={ROUTES.LOGIN} element={<LazyLoadedRoutes.Login />} />
          <Route path={ROUTES.VERIFY} element={<LazyLoadedRoutes.Verify />} />
          <Route path={ROUTES.ONBOARD} element={<LazyLoadedRoutes.Onboard />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          {/* Protected app routes, only accessible if user is logged in */}
          <Route path={ROUTES.HOME} element={<LazyLoadedRoutes.Home />} />
          <Route path={ROUTES.LOCAL} element={<LazyLoadedRoutes.LocalHourlyRentalPage />} />
          <Route
            path={ROUTES.AIRPORT}
            element={<LazyLoadedRoutes.AirportTransferPage />}
          />
          <Route path={ROUTES.OUTSTATION} element={<LazyLoadedRoutes.OutstationPage />} />
          <Route path={ROUTES.BOOKING} element={<LazyLoadedRoutes.BookingPage />} />
          <Route path={ROUTES.PAYMENT_PENDING_CONFIRMATION} element={<LazyLoadedRoutes.PaymentPendingConfirmationPage />} />
          <Route path={ROUTES.BOOKING_DETAIL} element={<LazyLoadedRoutes.BookingDetailPage />} />
          <Route path={ROUTES.MY_TRIPS} element={<LazyLoadedRoutes.MyTripsPage />} />
          <Route path={ROUTES.PROFILE} element={<LazyLoadedRoutes.CustomerProfilePage />} />
        
        </Route>

         <Route path={ROUTES.LEGAL_PAGE} element={<LazyLoadedRoutes.LegalPage />} />
         <Route path={ROUTES.VERIFY_EMAIL} element={<LazyLoadedRoutes.VerifyEmail />} />
          
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
