// src/hooks/useBookingDetailBackNavigation.js
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils";
import { resolveBookingReturn } from "@/payments";

export function useBookingDetailBackNavigation(cameFromPaymentPage = false, tripTypeRoute = ROUTES.HOME) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const returnTo = state?.bookingReturnTo;

  return useCallback(() => {
    if (cameFromPaymentPage) {
      const destination = resolveBookingReturn(returnTo, tripTypeRoute, ROUTES.HOME, tripTypeRoute !== ROUTES.LOCAL);
      navigate(destination.to, destination.options);
      return;
    }

    navigate(-1);
  }, [cameFromPaymentPage, tripTypeRoute, returnTo, navigate]);
}
