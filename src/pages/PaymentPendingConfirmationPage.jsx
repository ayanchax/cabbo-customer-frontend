import { useContext, useEffect, useRef } from "react";
import {
  ArrowRight,
  CircleAlert,
  Clock3,
  LifeBuoy,
  LockKeyhole,
  RefreshCw,
  SearchX,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PaymentContext, PAYMENT_PHASE } from "@/payments";
import { TripSupportCard, Footer, InfoOverlay } from "@/components";
import { APP, ROUTES, SERVER_STATUS_CODES } from "@/utils";

const actionClass =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:w-auto cursor-pointer";
const primaryActionClass = `${actionClass} bg-primary text-white hover:bg-primary-hover disabled:cursor-wait disabled:bg-primary/70`;
const secondaryActionClass = `${actionClass} border border-gray-200 bg-white text-gray-700 hover:bg-gray-50`;
const paymentReassurance =
  "We're checking with our payment partner to confirm your payment status. Please don't pay again.";

export default function PaymentPendingConfirmationPage() {
  const { pending, view, checkAgain, supportContext } =
    useContext(PaymentContext);
  const { phase, status } = view;
  const reference = pending?.temp_trip_id || view.reference;
  const checking = phase === PAYMENT_PHASE.CHECKING && Boolean(reference);
  const headingRef = useRef(null);

  useEffect(() => {
    // A new recovery outcome is a view change, not another polling announcement.
    if (!checking) headingRef.current?.focus();
  }, [checking, phase]);
  const review = phase === PAYMENT_PHASE.REVIEW;
  const missing = phase === PAYMENT_PHASE.MISSING;
  const bookingReference = status?.booking_id || pending?.booking_id;
  const canRecheck = Boolean(
    reference && !review && !missing && phase !== PAYMENT_PHASE.AUTH,
  );
  const canShowSupport = Boolean(
    supportContext?.origin && supportContext?.tripType,
  );

  // Waiting
  let title = "Your booking isn't confirmed yet";
  let label = "Awaiting confirmation";
  let message = `${paymentReassurance} If your booking is confirmed, it will appear in Upcoming Trips.`;
  let StatusIcon = Clock3;

  // Review, access, reference, auth, missing
  if (review) {
    title = "Your booking needs attention";
    label = "Support needed";
    message =
      status?.message ||
      "Our support team can help you check what's happening with your booking. Please get in touch.";
    StatusIcon = CircleAlert;
  } else if (phase === PAYMENT_PHASE.ACCESS) {
    title = "We couldn't check your booking";
    label = "Status unavailable";
    message =
      view?.code === SERVER_STATUS_CODES.FORBIDDEN
        ? "We can't check this booking with the account you're signed in to. Please contact support for help."
        : "We couldn't get an update on this booking. Try checking again, or contact support for help.";
    StatusIcon = CircleAlert;
  } else if (phase === PAYMENT_PHASE.REFERENCE) {
    title = "We couldn't load your booking details";
    label = "Details unavailable";
    message =
      "We found your booking, but couldn't load all its details. Check Upcoming Trips or contact support for help.";
    StatusIcon = CircleAlert;
  } else if (phase === PAYMENT_PHASE.AUTH) {
    title = "Sign in to check your booking";
    label = "Sign in again";
    message =
      "Please sign in again so we can check your payment and booking status.";
    StatusIcon = LockKeyhole;
  } else if (missing) {
    title = "We couldn't find this booking";
    label = "Booking not found";
    message =
      "We couldn't find this booking. You can start a new one. If you were charged, please contact support so we can help check your payment.";
    StatusIcon = SearchX;
  }
  // No reference
  if (!reference) {
    title = "We couldn't find your booking";
    label = "Booking status";
    message =
      "There's no booking saved on this device for us to check. Your booking may still appear in Upcoming Trips. If you were charged, please contact support so we can help check your payment and assist with your booking.";
    StatusIcon = SearchX;
  }
  const needsAttention = reference && [
    PAYMENT_PHASE.REVIEW,
    PAYMENT_PHASE.ACCESS,
    PAYMENT_PHASE.REFERENCE,
    PAYMENT_PHASE.AUTH,
  ].includes(phase);

  if (checking) {
    return (
      <InfoOverlay
        visible
        message="Confirming your booking"
        subtext="Please keep this page open while we check your booking."
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50 text-secondary">
      <header className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        <Link
          to={ROUTES.HOME}
          aria-label={`${APP.name} home`}
          className="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <img
            src={import.meta.env.VITE_APP_LOGO_URL}
            alt={APP.name}
            className="h-auto w-28 sm:w-32"
          />
        </Link>
      </header>

      <main
        className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-6 sm:pb-16"
        aria-labelledby="payment-status-title"
      >
        <div className="w-full max-w-lg">
          <section className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-[0_8px_40px_-16px_rgba(15,23,42,0.12)]">
            <div className="px-5 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
              <div
                className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${needsAttention ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-primary"}`}
              >
                <StatusIcon
                  aria-hidden="true"
                  strokeWidth={1.6}
                  className="size-8"
                />
              </div>
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="mt-6 text-center"
              >
                <p
                  className={`text-xs font-semibold ${needsAttention ? "text-amber-700" : "text-primary"}`}
                >
                  {label}
                </p>
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  id="payment-status-title"
                  className="mt-2 text-2xl font-bold tracking-tight text-gray-950 outline-none sm:text-[28px] sm:leading-tight"
                >
                  {title}
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
                  {message}
                </p>
              </div>

              {reference && (
                <dl className="mt-6 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3.5">
                  <dt className="text-xs font-medium text-gray-500">
                    Booking ID
                  </dt>
                  <dd className="mt-1.5 break-all font-mono text-xs leading-5 text-gray-700 sm:text-sm">
                    {bookingReference || reference}
                  </dd>
                </dl>
              )}

              {needsAttention && (
                  <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                    Please don't make another payment for this booking yet.
                  </p>
                )}

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                {canRecheck && (
                  <button
                    type="button"
                    onClick={checkAgain}
                    className={`${primaryActionClass} sm:flex-1`}
                  >
                    <RefreshCw aria-hidden="true" className="size-4" />
                    Check status again
                  </button>
                )}
                {missing && (
                  <Link
                    to={ROUTES.HOME}
                    className={`${primaryActionClass} sm:flex-1`}
                  >
                    New booking{" "}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                )}
                {phase === PAYMENT_PHASE.AUTH && (
                  <Link
                    to={ROUTES.LOGIN}
                    className={`${primaryActionClass} sm:flex-1`}
                  >
                    Sign in <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                )}
                <Link
                  to={`${ROUTES.MY_TRIPS}?tab=upcoming`}
                  className={`${canRecheck || missing || phase === PAYMENT_PHASE.AUTH ? secondaryActionClass : primaryActionClass} sm:flex-1`}
                >
                  Upcoming Trips
                </Link>
              </div>
            </div>

          </section>

          {canShowSupport ? (
            <TripSupportCard
              origin={supportContext?.origin}
              tripType={supportContext?.tripType}
              tripLabel={supportContext?.tripLabel}
              bookingId={bookingReference || reference}
              reason="I need help checking my payment and booking status"
              title="Need help with this booking?"
              description="Our support team can help you check your payment and booking status."
              className="mt-4"
            />
          ) : (
            <div className="mt-5 text-center">
              <Link
                to={`${ROUTES.LEGAL}/help-support`}
                className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-xs font-medium text-gray-500 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <LifeBuoy aria-hidden="true" className="size-4" /> Need help?
                Contact support
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer className="px-5 pb-6 text-center text-xs text-gray-500" />
    </div>
  );
}
