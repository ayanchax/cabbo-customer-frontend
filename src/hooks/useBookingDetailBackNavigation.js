// src/hooks/useBookingDetailBackNavigation.js
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils";

export function useBookingDetailBackNavigation(cameFromPaymentPage = false) {
  const navigate = useNavigate();

  return useCallback(() => {
    if (cameFromPaymentPage) {
      navigate(ROUTES.HOME, { replace: true });
      return;
    }

    navigate(-1);
  }, [cameFromPaymentPage, navigate]);
}