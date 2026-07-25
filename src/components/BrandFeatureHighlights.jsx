import everydayMadeEasy from "@/assets/brand-features/everyday-made-easy.png";
import airportSpecialistOnTime from "@/assets/brand-features/airport-specialist-on-time.png";
import escapeTheRoutineOutstation from "@/assets/brand-features/escape-the-routine-outstation.png";
import meetNGreetPlacards from "@/assets/brand-features/meet-n-greet-placards.png";
import premiumExperienceTwo from "@/assets/brand-features/premium-exp-2.png";
import trustFirstFairFare from "@/assets/brand-features/trust-first-fair-fare.png";

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
    id: "meet-n-greet-placards",
    image: meetNGreetPlacards,
    alt: "Cabbo airport meet and greet placard support",
  },
   
];

function BrandFeatureHighlights() {
  return (
    <section
      aria-labelledby="brand-features-title"
      className="mx-auto mt-6 max-w-2xl px-4 pb-8 sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:w-3/4 xl:max-w-7xl"
    >
      <div className="mb-3">
        <h2
          id="brand-features-title"
          className="text-base font-semibold text-gray-950 md:text-lg"
        >
          Built for planned rides
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500 md:text-[15px]">
          Airport, hourly, and outstation trips with clear fares and support
          when you need it.
        </p>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide sm:mx-0 sm:px-0 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
        {brandFeatures.map((feature) => (
          <article
            key={feature.id}
            className="min-w-[78%] snap-start overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:min-w-[46%] md:min-w-0"
          >
            <img
              src={feature.image}
              alt={feature.alt}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </article>
        ))}
      </div>
    </section>
  );
}

export { BrandFeatureHighlights };
