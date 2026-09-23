import React, { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState, Splash } from "@/components";
import { ROUTES } from "@/utils";
import { campaignRegistry } from "./campaignRegistry";

const CampaignUnavailableIllustration = (
  <svg
    width="128"
    height="128"
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="128" height="128" rx="32" fill="#EFF6FF" />
    <rect x="24" y="34" width="80" height="56" rx="10" fill="white" />
    <rect x="24" y="34" width="80" height="56" rx="10" stroke="#BFDBFE" strokeWidth="2" />
    <path d="M36 48H74" stroke="#0B5FFF" strokeWidth="4" strokeLinecap="round" />
    <path d="M36 60H88" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
    <path d="M36 72H68" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
    <circle cx="92" cy="38" r="12" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="2" />
    <path d="M88 34L96 42M96 34L88 42" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M42 96C50 90 78 90 86 96" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

function UnknownCampaignState() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <section className="mx-auto max-w-screen-sm rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
        <EmptyState
          illustration={CampaignUnavailableIllustration}
          title="Campaign unavailable"
          message="This campaign may have ended or the link may be incorrect."
          className="py-8"
          action={
            <Link
              to={ROUTES.HOME}
              className="inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Go to Cabbo
            </Link>
          }
        />
      </section>
    </main>
  );
}

function CampaignDetail() {
  const { campaignId } = useParams();
  const CampaignComponent = campaignRegistry[campaignId];

  if (!CampaignComponent) {
    return <UnknownCampaignState />;
  }

  return (
    <Suspense fallback={<Splash message="Loading campaign..." />}>
      <CampaignComponent />
    </Suspense>
  );
}

export { CampaignDetail };
