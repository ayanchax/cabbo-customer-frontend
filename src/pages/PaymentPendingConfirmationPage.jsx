import React, { useState } from "react";
import { ArrowRight, BadgeAlert, Home, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Disclaimer, TripSupportCard } from "@/components";
import { APP, ROUTES } from "@/utils";

function PaymentPendingConfirmationPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const origin = state?.origin || null;
  const tripType = state?.tripType || null;
  const tripLabel = state?.tripLabel || "trip";
  const canShowTripSupport = Boolean(origin && tripType);

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-2xl items-start sm:min-h-[calc(100vh-3rem)] sm:items-center">
        <section className="w-full rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-7">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-amber-100">
            <BadgeAlert className="h-7 w-7" aria-hidden="true" />
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase text-amber-700">
              Booking needs attention
            </p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight text-gray-950 sm:text-3xl">
              We could not confirm your trip yet
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              Your payment went through, but your booking is taking longer than
              usual to appear. Please check <strong>My trips</strong> after some time. If it
              still does not show up, contact support and we will help sort it
              out.
            </p>
          </div>

          {canShowTripSupport && (
            <TripSupportCard
              origin={origin}
              tripType={tripType}
              tripLabel={tripLabel}
              reason="Payment was successful but trip confirmation is pending"
              defaultOpen
              title="Contact support to recover this booking"
              description="Mention your registered phone number and that your payment was successful but trip confirmation is still pending."
              className="mt-5"
              onToggle={setShowDisclaimer}
            />
          )}

          {!canShowTripSupport && (
            <p className="mt-5 text-xs leading-5 text-gray-500">
              When you contact support, mention your registered phone number and
              that your payment was successful but trip confirmation is still
              pending.
            </p>
          )}

          {showDisclaimer && (
            <Disclaimer
              variant="success"
              className="mt-5"
              icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
              message="If we cannot resolve the booking, your money will be refunded to the original payment source once our team verifies your payment details."
            />
          )}

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase text-gray-500">
              You can also
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate(ROUTES.MY_TRIPS, { replace: true })}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                View my trips
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.HOME, { replace: true })}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Go home
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PaymentPendingConfirmationPage;
