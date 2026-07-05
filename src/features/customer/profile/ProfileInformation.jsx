import React, { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  LogOut,
  Phone,
  ShieldCheck,
  CarFront,
} from "lucide-react";
import { PageHeader } from "@/components";
import { useAuth, useCustomer, useLogoutCustomer } from "@/hooks";
import { APP, getInitials, ROUTES } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileEmail, ProfileItemDetailRow, ProfileLegalLinks, ProfileName, ProfilePicture, ProfileStat } from "./components";

function ProfileInformation() {
  const { customer, firstName, joinedOn: joinedOnLabel } = useCustomer();
  const { logout } = useAuth();
  const logoutCustomer = useLogoutCustomer();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const logoutConfirmRef = useRef(null);
  const confirmLogoutButtonRef = useRef(null);

  const initials = getInitials(customer?.name || firstName);
  const numberOfTrips =
    typeof customer?.number_of_trips === "number"
      ? `${customer.number_of_trips} ${customer.number_of_trips === 1 ? "trip" : "trips"}`
      : null;
  const isLoggingOut = logoutCustomer.isPending || logoutCustomer.isLoading;

  const handleLogout = async () => {
    try {
      await logoutCustomer.mutateAsync();
    } catch {
      // Even if the backend logout call fails, clear this device's session.
    } finally {
      queryClient.clear();
      logout(); // clear the token from local storage
      navigate(ROUTES.LOGIN, { replace: true }); // redirect to login page and remove the current page from history so that user cannot go back to it using browser back button
    }
  };

  useEffect(() => {
    if (!showLogoutConfirm) return;

    window.requestAnimationFrame(() => {
      logoutConfirmRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      confirmLogoutButtonRef.current?.focus({ preventScroll: true });
    });
  }, [showLogoutConfirm]);

  return (
    <div className="relative mx-auto min-h-screen max-w-full overflow-visible bg-gray-50 px-2 py-2 shadow-[0_2px_16px_0_rgba(16,30,54,0.08)] sm:max-w-screen-sm sm:rounded-xl sm:bg-white sm:px-4 sm:py-6 sm:shadow-lg md:max-w-3xl md:px-6 md:py-8 lg:max-w-5xl lg:px-8 lg:py-10 xl:mb-4 xl:w-1/2 xl:px-10 2xl:max-w-screen-2xl">
      <div className="relative z-10 px-4">
        <PageHeader
          title="My Profile"
          subtitle={`Manage your ${APP.name} account`}
          className="px-0 mb-4"
        />

        {/* Profile name, picture and metadata */}
        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Profile picture */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-primary/5 text-primary ring-1 ring-blue-100">
              <ProfilePicture
                pictureUrl={customer?.profile_picture_url}
                alt={`${customer?.name || "Customer"} profile picture`}
                initials={initials}
              />
            </div>

            <div className="min-w-0 flex-1">
              {/* Profile name */}
              <ProfileName name={customer?.name} />
              {/* Metadata like joined date and number of trips */}
              {(joinedOnLabel || numberOfTrips) && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <ProfileStat
                    icon={CalendarDays}
                    label="Joined"
                    value={joinedOnLabel}
                  />
                  <ProfileStat
                    icon={CarFront}
                    label="Cabbo rides"
                    value={numberOfTrips}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Profile items with details */}
        <section className="mt-4 space-y-3">
          {/* Phone */}
          <ProfileItemDetailRow
            icon={Phone}
            label="Phone number"
            value={customer?.phone_number || "Unavailable"}
            helper="Used for login and receiving booking updates."
            badge={
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            }
          />
          {/* Email */}
          <ProfileEmail
            email={customer?.email}
            isVerified={customer?.is_email_verified}
            canReinitiateVerification={
              customer?.can_reinitiate_email_verification
            }
          />
        </section>
        {/* Legal links */}
        <ProfileLegalLinks />

        {/* Logout section */}
        <section className="mt-4 rounded-xl border border-red-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 ring-1 ring-red-100">
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-950">Log out</h2>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  You can sign in again anytime using your phone number.
                </p>
              </div>
            </div>

            {!showLogoutConfirm && (
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100"
              >
                Log out
              </button>
            )}
          </div>

          {showLogoutConfirm && (
            <div
              ref={logoutConfirmRef}
              className="mt-4 rounded-lg border border-red-100 bg-red-50/60 p-3"
            >
              <p className="text-sm font-semibold text-gray-950">
                Log out of {APP.name}?
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-600">
                This will end your session on this device.
              </p>
              <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Stay logged in
                </button>
                <button
                  type="button"
                  ref={confirmLogoutButtonRef}
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-red-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingOut ? "Logging out..." : "Confirm logout"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export { ProfileInformation };
