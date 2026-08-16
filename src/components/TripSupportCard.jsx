import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  LifeBuoy,
  MessageCircle,
  Phone,
  RefreshCw,
} from "lucide-react";
import { useGetSupportContactsForBooking } from "@/hooks";
import { APP, ROUTES } from "@/utils";
function normalizePhoneForWhatsApp(phoneNumber) {
  if (!phoneNumber) return "";
  return phoneNumber.replace(/[^\d]/g, "");
}

function buildSupportMessage({ bookingId, tripLabel, reason }) {
  const lines = [
    `Hi ${APP.name} Support, I need help with my booking.`,
    bookingId ? `Booking ID: ${bookingId}` : null,
    tripLabel ? `Trip: ${tripLabel}` : null,
    reason ? `Reason: ${reason}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

function TripSupportCard({
  bookingId,
  origin,
  tripType,
  tripLabel = "trip",
  reason = "Booking help",
  defaultOpen = false,
  title = "Need help with this trip?",
  onToggle=()=>{},
  description = `Call or message ${APP.name} support for this booking.`,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const supportPanelRef = useRef(null);
  const shouldScrollToSupportRef = useRef(false);
  const supportMutation = useGetSupportContactsForBooking();
  const supportContact = supportMutation.data || null;
  const canLoadSupport = Boolean(origin && tripType);

  const supportPayload = useMemo(
    () => ({
      origin,
      trip_type: tripType,
    }),
    [origin, tripType],
  );

  const supportMessage = useMemo(
    () => buildSupportMessage({ bookingId, tripLabel, reason }),
    [bookingId, reason, tripLabel],
  );

  const whatsappNumber = normalizePhoneForWhatsApp(
    supportContact?.whatsapp_number || supportContact?.phone_number,
  );
  const phoneNumber = supportContact?.phone_number || null;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(supportMessage)}`
    : null; //In mobile this will open the WhatsApp app, in desktop it will open WhatsApp Web. If the user doesn't have WhatsApp installed, it will redirect to the WhatsApp download page.
  const phoneHref = phoneNumber ? `tel:${phoneNumber}` : null; //In mobile this will open the phone dialer with the number pre-filled. In desktop it will open the default calling app (if any) with the number pre-filled.


  const loadSupportContact = () => {
    if (!canLoadSupport || supportMutation.isPending || supportContact) return; // Don't load if we can't, or if we're already loading, or if we already have the contact.
    supportMutation.mutate(supportPayload);
  };

  const handleToggle = () => {
    const nextIsOpen = !isOpen;
    shouldScrollToSupportRef.current = nextIsOpen;
    setIsOpen(nextIsOpen);
    onToggle(nextIsOpen)
  };

  useEffect(() => {
    if (isOpen) {
      loadSupportContact();
    }
    // supportPayload is memoized from origin/tripType; load only when opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !supportContact || !shouldScrollToSupportRef.current) return;

    window.requestAnimationFrame(() => {
      supportPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      shouldScrollToSupportRef.current = false;
    });
  }, [isOpen, supportContact]);

  return (
    <section
      className={`rounded-xl border border-gray-100 bg-white p-3 shadow-sm ${className}`}
      aria-label="Trip support"
    >
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary ring-1 ring-primary/10">
            <LifeBuoy className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-gray-950">
              {title}
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-gray-500">
              {description}
            </span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div ref={supportPanelRef} className="mt-3 border-t border-gray-100 pt-3">
          {!canLoadSupport && (
            <p className="text-xs leading-5 text-amber-700">
              Support contact is unavailable for this booking right now.
            </p>
          )}

          {supportMutation.isPending && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Finding the right {APP.name} support contact...
            </div>
          )}

          {supportMutation.isError && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-amber-700">
                We couldn't load support contact details. Please try again.
              </p>
              <button
                type="button"
                onClick={() => {
                  shouldScrollToSupportRef.current = true;
                  supportMutation.mutate(supportPayload);
                }}
                className="inline-flex h-8 w-fit cursor-pointer items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
              >
                Retry
              </button>
            </div>
          )}

          {supportContact && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {supportContact.display_name ||
                    `${APP.name} Customer Support`}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  When you call us, please mention your registered mobile number so we can find this booking quickly.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {phoneHref && (
                  <a
                    href={phoneHref}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call {APP.name}
                  </a>
                )}
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp
                  </a>
                )}
              </div>

              <div className="mt-3 text-xs leading-5 text-gray-500">
            To know more about how {APP.name} handles support requests, please
            read our{" "}
            <a
              href={`${ROUTES.LEGAL}/help-support`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-2 hover:text-primary/90"
            >
              support policy
            </a>
            .
          </div>
            </div>
          )}
          
        </div>
      )}
    </section>
  );
}

export { TripSupportCard };
