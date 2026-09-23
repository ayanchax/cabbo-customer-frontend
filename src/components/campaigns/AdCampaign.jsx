import React, { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { ANALYTICS_EVENTS, useAnalytics } from "@/analytics";
import { useClientGeography } from "@/hooks";

const getCampaignUrl = (slug) => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || "";
  return `${baseUrl}/${slug}`.replace(/([^:]\/)\/+/g, "$1");
};

const withCampaignParams = ({ url, placement, campaignKey }) => {
  if (!url) return "";

  try {
    const campaignUrl = new URL(url);
    campaignUrl.searchParams.set("utm_source", "ad_campaign_banner");
    campaignUrl.searchParams.set("utm_medium", "cabbo_app");
    campaignUrl.searchParams.set("utm_campaign", campaignKey);
    campaignUrl.searchParams.set("utm_content", placement);
    return campaignUrl.toString();
  } catch {
    return url;
  }
};

function AdCampaign({
  enabled = false,
  placement = "home",
  className = "",
  imageSrc,
  slug = "slug",
  campaignKey = "unique_campaign_key",
  ariaLabel = "aria label of the campaign",
  altText = "Alt text for the campaign image",
  runAdInRegions = [],
}) {
  const { track } = useAnalytics();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { clientGeographyData } = useClientGeography();
  const clientRegionCode = clientGeographyData?.region_code?.toUpperCase() || null;
  const campaignRegionCodes = runAdInRegions.map((region) =>
    String(region).toUpperCase(),
  );
  const hasRegionGate = campaignRegionCodes.length > 0;
  const shouldRender =
    enabled &&
    imageSrc &&
    (!hasRegionGate ||
      (clientRegionCode && campaignRegionCodes.includes(clientRegionCode)));
  const campaignUrl = withCampaignParams({
    url: getCampaignUrl(slug),
    placement,
    campaignKey,
  });

  useEffect(() => {
    if (!shouldRender) return;

    track(ANALYTICS_EVENTS.AD_CAMPAIGN_BANNER_VIEWED, {
      campaign_key: campaignKey,
      placement,
      slug,
      region_code: clientRegionCode,
      has_region_gate: hasRegionGate,
    });
  }, [
    campaignKey,
    clientRegionCode,
    hasRegionGate,
    placement,
    shouldRender,
    slug,
    track,
  ]);

  if (!shouldRender) return null;

  return (
    <a
      href={campaignUrl}
      onClick={() =>
        track(ANALYTICS_EVENTS.AD_CAMPAIGN_BANNER_CLICKED, {
          campaign_key: campaignKey,
          placement,
          slug,
          region_code: clientRegionCode,
          destination_url: campaignUrl,
          utm_source: "ad_campaign_banner",
          utm_medium: "cabbo_app",
          utm_campaign: campaignKey,
          utm_content: placement,
        })
      }
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      className={`relative block overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
    >
      {!isImageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/70">
          <LoaderCircle
            className="h-5 w-5 animate-spin text-primary/70"
            aria-hidden="true"
          />
        </div>
      )}
      <img
        src={imageSrc}
        alt={altText}
        decoding="async"
        onLoad={() => setIsImageLoaded(true)}
        onError={() => setIsImageLoaded(true)}
        className={`block h-auto w-full transition-opacity duration-300 ${
          isImageLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading={placement === "login" ? "eager" : "lazy"}
      />
    </a>
  );
}

export { AdCampaign };
