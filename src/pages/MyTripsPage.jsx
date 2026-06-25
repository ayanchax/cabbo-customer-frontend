import React, { lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader, PageHeader } from "@/components";
import { TRIP_OCCURENCE_LABELS } from "@/utils";
import { AppLayout } from "@/layouts";

const UpcomingTrips = lazy(() =>
  import("@/features/trips/Upcoming").then((m) => ({ default: m.Upcoming })),
);

const OngoingTrips = lazy(() =>
  import("@/features/trips/Ongoing").then((m) => ({ default: m.Ongoing })),
);

const PastTrips = lazy(() =>
  import("@/features/trips/Past").then((m) => ({ default: m.Past })),
);

const TABS = [
  { id: TRIP_OCCURENCE_LABELS.UPCOMING, label: "Upcoming" },
  { id: TRIP_OCCURENCE_LABELS.ONGOING, label: "Ongoing" },
  { id: TRIP_OCCURENCE_LABELS.PAST, label: "Past" },
];
function MyTripsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get("tab") || TRIP_OCCURENCE_LABELS.UPCOMING;
  const activeTab = TABS.some((tab) => tab.id === selectedTab)
    ? selectedTab
    : TRIP_OCCURENCE_LABELS.UPCOMING;

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  let TripsComponent;
  switch (activeTab) {
    case TRIP_OCCURENCE_LABELS.UPCOMING:
      TripsComponent = <UpcomingTrips />;
      break;
    case TRIP_OCCURENCE_LABELS.ONGOING:
      TripsComponent = <OngoingTrips />;
      break;
    case TRIP_OCCURENCE_LABELS.PAST:
      TripsComponent = <PastTrips />;
      break;
    default:
      TripsComponent = <UpcomingTrips />;
  }

  return (
    <AppLayout>
      <div className="relative mx-auto min-h-screen max-w-full overflow-y-auto bg-gray-50 px-2 py-2 shadow-[0_2px_16px_0_rgba(16,30,54,0.08)] sm:max-w-screen-sm sm:rounded-xl sm:bg-white sm:px-4 sm:py-6 sm:shadow-lg md:max-w-3xl md:px-6 md:py-8 lg:max-w-5xl lg:px-8 lg:py-10 xl:mb-4 xl:w-3/4 xl:px-10 2xl:max-w-screen-2xl">
        <div className="px-4">
          <PageHeader title="My trips" className="px-0 mb-3" />

          <div className="mx-auto w-full max-w-4xl">
            <div className="sticky top-0 z-10 -mx-2 bg-gray-50/95 px-2 pb-3 pt-1 backdrop-blur sm:bg-white/95">
              <div className="flex items-center gap-2 overflow-x-auto rounded-lg border border-gray-100 bg-white p-1 shadow-sm">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      className={`cursor-pointer flex min-w-fit flex-1 items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "bg-primary text-white shadow-sm"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <Suspense fallback={<Loader message={`Loading ${activeTab.toLowerCase()} trips...`} />}>
              {TripsComponent}
            </Suspense>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default MyTripsPage;
