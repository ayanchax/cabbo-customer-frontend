import React from "react";
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
  const { clientGeographyData } = useClientGeography();
  const clientRegionCode = clientGeographyData?.region_code?.toUpperCase() || null;
  const campaignRegionCodes = runAdInRegions.map((region) =>
    String(region).toUpperCase(),
  );
  const hasRegionGate = campaignRegionCodes.length > 0;

  if (!enabled || !imageSrc) return null;

  if (
    hasRegionGate &&
    (!clientRegionCode || !campaignRegionCodes.includes(clientRegionCode))
  ) {
    return null;
  }

  return (
    <a
      href={withCampaignParams({
        url: getCampaignUrl(slug),
        placement,
        campaignKey,
      })}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      className={`block overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
    >
      <img
        src={imageSrc}
        alt={altText}
        className="block h-auto w-full"
        loading={placement === "login" ? "eager" : "lazy"}
      />
    </a>
  );
}

export { AdCampaign };
