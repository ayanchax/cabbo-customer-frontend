import React, { useEffect, useRef, useState } from "react";
import { CalendarDays, Info, MessageCircle, Phone, Route } from "lucide-react";
import campaignBanner from "@/assets/campaigns/blr/durga-puja-2026/campaign-detail.png";
import { APP } from "@/utils";

const WHATSAPP_MESSAGE = `Hi ${APP.name}, I want to book a Durga Puja pandal-hopping cab in Bengaluru.`;

const CALL_BOOKING_SUPPORT_NUMBER = "+919831305667";
const WHATSAPP_BOOKING_SUPPORT_NUMBER = CALL_BOOKING_SUPPORT_NUMBER.replace(
  "+",
  "",
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_BOOKING_SUPPORT_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const suggestedPujos = [
  { name: "Begur Bengali Sharodiya Durgotsav", area: "Milana Greens, Begur" },
  { name: "BARSHA Bengali Association", area: "Haralur, off Sarjapur Road" },
  { name: "Sarathi Cultural Association", area: "Koramangala 5th Block" },
  { name: "Kolaj Durga Puja", area: "Koramangala" },
  { name: "Amader Pujo (KARBA)", area: "Kanakapura Road" },
  { name: "Sanskritik Durga Puja", area: "JP Nagar Phase 6" },
  {
    name: "Electronic City Cultural Association",
    area: "Electronic City Phase 1",
  },
  { name: "East Bangalore Cultural Association (EBCA)", area: "Whitefield" },
  { name: "Whitefield Cultural Association", area: "Nallurhalli, Whitefield" },
  {
    name: "Sarjapur Outer Ring Road Bengali Association (SORBA)",
    area: "Doddakannalli",
  },
  { name: "Socio-Cultural Association", area: "Indiranagar" },
  { name: "Ulsoor Durga Puja", area: "Ulsoor" },
  { name: "Jayamahal Cultural Association", area: "Jayamahal Extension" },
  { name: "RT Nagar Socio-Cultural Trust", area: "RT Nagar" },
  { name: "BSS Durga Puja", area: "The Occasion Bengaluru, Hoodi" },
  {
    name: "SBSF Sylheti Forum Durga Puja",
    area: "Tarani Garden, Sulikunte, Sarjapur Road",
  },
];
const packages = [
  {
    duration: "4 hours",
    distance: "40 km",
    smallCar: "₹1,999",
    largeCar: "₹2,799",
  },
  {
    duration: "6 hours",
    distance: "60 km",
    smallCar: "₹2,999",
    largeCar: "₹4,199",
  },
  {
    duration: "8 hours",
    distance: "80 km",
    smallCar: "₹3,999",
    largeCar: "₹5,599",
  },
  {
    duration: "10 hours",
    distance: "100 km",
    smallCar: "₹4,999",
    largeCar: "₹6,999",
  },
  {
    duration: "12 hours",
    distance: "120 km",
    smallCar: "₹6,399",
    largeCar: "₹8,799",
  },
];

function DurgaPujaBengaluru2026() {
  const primaryActionsRef = useRef(null);
  const [showFloatingActions, setShowFloatingActions] = useState(false);

  useEffect(() => {
    const primaryActions = primaryActionsRef.current;
    if (!primaryActions) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingActions(!entry.isIntersecting);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(primaryActions);

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-[#fff8f2] text-gray-950">
      <section className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        <img
          src={campaignBanner}
          alt="Durga Puja 2026 Bengaluru cab packages by Cabbo"
          className="w-full rounded-2xl border border-red-100 bg-white shadow-sm"
        />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
                Bengaluru pandal-hopping packages
              </p>
              <h1 className="mt-2 text-2xl font-bold leading-tight text-gray-950 sm:text-3xl">
                Durga Puja rides with {APP.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Time-bound cab packages for Durga Puja pandal visits in
                Bengaluru. Send an enquiry and {APP.name} will confirm
                availability, vehicle category, pickup time, and payment details
                manually.
              </p>
            </div>

            <div
              ref={primaryActionsRef}
              className="flex shrink-0 flex-col gap-2 xs:flex-row md:flex-col"
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12823d] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp {APP.name}
              </a>
              <a
                href={`tel:${CALL_BOOKING_SUPPORT_NUMBER}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {APP.name}
              </a>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-red-50 p-4">
              <CalendarDays
                className="h-5 w-5 text-red-700"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm font-semibold">Booking window</p>
              <p className="text-sm text-gray-600">Upto 15th October</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <Route className="h-5 w-5 text-amber-700" aria-hidden="true" />
              <p className="mt-2 text-sm font-semibold">Service area</p>
              <p className="text-sm text-gray-600">
                Bengaluru-origin Puja visits
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-4">
              <MessageCircle
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm font-semibold">Booking mode</p>
              <p className="text-sm text-gray-600">
                Manual enquiry and confirmation. Just give us a call.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-5 rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-gray-950">Packages</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
            <div className="grid grid-cols-4 bg-gray-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span>Package</span>
              <span>Distance</span>
              <span>Small car</span>
              <span>Large car</span>
            </div>
            {packages.map((item) => (
              <div
                key={item.duration}
                className="grid grid-cols-4 border-t border-gray-100 px-3 py-3 text-sm"
              >
                <span className="font-semibold text-gray-950">
                  {item.duration}
                </span>
                <span className="text-gray-600">{item.distance}</span>
                <span className="text-gray-950">{item.smallCar}</span>
                <span className="text-gray-950">{item.largeCar}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Overages / Extras
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-gray-700">
              <span className="rounded-full bg-red-50 px-3 py-1.5 ring-1 ring-red-100">
                Small car: ₹300 / extra hour
              </span>
              <span className="rounded-full bg-red-50 px-3 py-1.5 ring-1 ring-red-100">
                Large car: ₹500 / extra hour
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1.5 ring-1 ring-amber-100">
                Small car: ₹12 / extra km
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1.5 ring-1 ring-amber-100">
                Large car: ₹18 / extra km
              </span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Important terms
            </p>
            <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-gray-500">
              <Info
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>
                Small cars include Dzire, Etios, or similar. Large cars include
                Ertiga, Innova, or similar. Vehicle model is subject to
                availability. 12-hour packages include driver allowance. Toll
                and parking are charged at actuals. You will be charged the full
                fare even if your trip is shorter than the booked duration or
                included mileage.
              </span>
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-gray-950">
            Pujo places to explore in Bengaluru
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Planning a day out or new to the Bengaluru Pujo scene? Here are a few community pujos you can check out across the city.
            
          </p>

          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {suggestedPujos.map(({ name, area }) => (
              <li key={name} className="rounded-xl bg-red-50/60 px-4 py-3">
                <span className="font-semibold text-gray-950">{name}</span>
                <span className="block text-gray-600">{area}</span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs leading-5 text-gray-500">
            This list is for everyone, whether you travel with {APP.name} or make
            your own plans. Check each organiser's latest venue and visiting hours before
            heading out. This is a list of suggestions, not a fixed itinerary.
          </p>
        </section>
      </section>
      {showFloatingActions && (
        <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp ${APP.name} for Durga Puja cab booking`}
            title={`WhatsApp ${APP.name}`}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-lg shadow-green-900/20 transition hover:bg-[#12823d] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:h-14 sm:w-14"
          >
            <MessageCircle
              className="h-5 w-5 sm:h-6 sm:w-6"
              aria-hidden="true"
            />
          </a>
          <a
            href={`tel:${CALL_BOOKING_SUPPORT_NUMBER}`}
            aria-label={`Call ${APP.name} for Durga Puja cab booking`}
            title={`Call ${APP.name}`}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-blue-900/20 transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:h-14 sm:w-14"
          >
            <Phone className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </a>
        </div>
      )}
    </main>
  );
}

export default DurgaPujaBengaluru2026;
