import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { Splash } from "@/components";
import { campaignRegistry } from "./campaignRegistry";
import { UnknownCampaign } from "./components";


function CampaignDetail() {
  const { campaignId } = useParams();
  const CampaignComponent = campaignRegistry[campaignId];

  if (!CampaignComponent) {
    return <UnknownCampaign />;
  }

  return (
    <Suspense fallback={<Splash message="Loading campaign..." />}>
      <CampaignComponent />
    </Suspense>
  );
}

export { CampaignDetail };
