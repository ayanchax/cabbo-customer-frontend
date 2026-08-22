import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import everydayMadeEasy from "@/assets/brand-features/everyday-made-easy.png";
import airportSpecialistOnTime from "@/assets/brand-features/airport-specialist-on-time.png";
import escapeTheRoutineOutstation from "@/assets/brand-features/escape-the-routine-outstation.png";
import meetNGreetPlacards from "@/assets/brand-features/meet-n-greet-placards.png";
import premiumExperienceTwo from "@/assets/brand-features/premium-exp-2.png";
import trustFirstFairFare from "@/assets/brand-features/trust-first-fair-fare.png";
import scheduledRidesThoughtfullyPlanned from "@/assets/brand-features/scheduled-rides-thoughtfully-planned.png";
import trustedDrivers from "@/assets/brand-features/trusted-drivers.png";

import {APP} from "@/utils"
const brandFeatures = [
  {
    id: "everyday-made-easy",
    image: everydayMadeEasy,
    alt: "Everyday Cabbo rides made easy",
  },
  {
    id: "airport-specialist-on-time",
    image: airportSpecialistOnTime,
    alt: "Cabbo airport rides planned around time",
  },
  {
    id: "escape-the-routine-outstation",
    image: escapeTheRoutineOutstation,
    alt: "Cabbo outstation rides for trips outside the city",
  },
  {
    id: "scheduled-rides-thoughtfully-planned",
    image: scheduledRidesThoughtfullyPlanned,
    alt: "Cabbo scheduled rides that are thoughtfully planned",
  },
  {
    id: "trust-first-fair-fare",
    image: trustFirstFairFare,
    alt: "Cabbo trusted service with fair fares",
  },
  {
    id: "premium-experience-two",
    image: premiumExperienceTwo,
    alt: "Cabbo comfortable cab experience",
  },
  {
    id: "trusted-drivers",
    image: trustedDrivers,
    alt: "Cabbo provides trusted drivers",
  },
  {
    id: "meet-n-greet-placards",
    image: meetNGreetPlacards,
    alt: "Cabbo airport meet and greet placard support",
  },
];

function BrandFeatureHighlights() {
  const [loadedImages, setLoadedImages] = useState({});

  const markImageLoaded = (featureId) => {
    setLoadedImages((current) => ({
      ...current,
      [featureId]: true,
    }));
  };

  return (
    <section
      aria-labelledby="brand-features-title"
      className="mx-auto mt-6 max-w-2xl px-4 pb-8"
    >
      <div className="mb-3">
        <h2
          id="brand-features-title"
          className="text-base font-semibold text-gray-950 md:text-lg"
        >
          {APP.tagline}
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500 md:text-[15px]">
       Reliable city, airport, and outstation trips with clear fares and helpful support.
        </p>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide sm:mx-0 sm:px-0 md:grid md:grid-cols-3 lg:grid-cols-2 md:overflow-visible">
        {brandFeatures.map((feature) => {
          const isLoaded = loadedImages[feature.id];

          return (
            <article
              key={feature.id}
              className="relative aspect-5/6 min-w-[78%] snap-start overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:min-w-[46%] md:min-w-0"
            >
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/70">
                  <LoaderCircle
                    className="h-5 w-5 animate-spin text-primary/70"
                    aria-hidden="true"
                  />
                </div>
              )}
              <img
                src={feature.image}
                alt={feature.alt}
                loading="lazy"
                decoding="async"
                onLoad={() => markImageLoaded(feature.id)}
                onError={() => markImageLoaded(feature.id)}
                className={`absolute inset-0 block h-full w-full object-cover transition-opacity duration-300 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}

export { BrandFeatureHighlights };
