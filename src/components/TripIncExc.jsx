import React from "react";
import {
  BadgeCheck,
  Bed,
  CarFront,
  Check,
  CircleParking,
  GlassWater,
  Headphones,
  IdCard,
  Landmark,
  MapPin,
  Moon,
  ReceiptText,
  Route,
  ShoppingBag,
  Sparkles,
  Utensils,
  UserCheck,
  X,
} from "lucide-react";

const DEFAULT_INCLUSION_DESCRIPTION = "Included in the fare shown for this booking.";
const DEFAULT_EXCLUSION_DESCRIPTION = "Handled separately from the fare shown.";

function normalizeItem(item, fallbackDescription) {
  if (!item) return null;

  if (typeof item === "string") {
    return {
      label: item,
      description: "",
      hasStructuredIcon: false,
    };
  }

  if (typeof item === "object" && item.label) {
    return {
      label: item.label,
      description: item.description || fallbackDescription,
      hasStructuredIcon: true,
    };
  }

  return null;
}

function normalizeLabel(label) {
  return String(label || "")
    .trim()
    .toLowerCase();
}

function getItemIconName(label, variant, hasStructuredIcon) {
  if (!hasStructuredIcon) return variant === "inclusion" ? "check" : "x";

  const normalizedLabel = normalizeLabel(label);

  if (normalizedLabel.includes("base fare")) return "receipt";
  if (normalizedLabel.includes("professional driver")) return "car";
  if (normalizedLabel.includes("pickup") || normalizedLabel.includes("drop")) {
    return "map-pin";
  }
  if (
    normalizedLabel.includes("platform") ||
    normalizedLabel.includes("convenience")
  ) {
    return "badge-check";
  }
  if (
    normalizedLabel.includes("sanitized") ||
    normalizedLabel.includes("well-maintained")
  ) {
    return "sparkles";
  }
  if (normalizedLabel.includes("support")) return "headphones";
  if (normalizedLabel.includes("toll")) return "route";
  if (normalizedLabel.includes("parking")) return "parking";
  if (normalizedLabel.includes("placard")) return "id-card";
  if (
    normalizedLabel.includes("water") ||
    normalizedLabel.includes("tissues") ||
    normalizedLabel.includes("candies")
  ) {
    return "water";
  }
  if (normalizedLabel.includes("driver allowance")) return "user-check";
  if (normalizedLabel.includes("state entry")) return "landmark";
  if (normalizedLabel.includes("personal expenses")) return "shopping";
  if (normalizedLabel.includes("meals")) return "utensils";
  if (normalizedLabel.includes("accommodation")) return "bed";
  if (normalizedLabel.includes("night")) return "moon";

  return variant === "inclusion" ? "check" : "x";
}

function TripIncExcIcon({ name, className = "" }) {
  if (name === "receipt") return <ReceiptText className={className} aria-hidden="true" />;
  if (name === "car") return <CarFront className={className} aria-hidden="true" />;
  if (name === "map-pin") return <MapPin className={className} aria-hidden="true" />;
  if (name === "badge-check") return <BadgeCheck className={className} aria-hidden="true" />;
  if (name === "sparkles") return <Sparkles className={className} aria-hidden="true" />;
  if (name === "headphones") return <Headphones className={className} aria-hidden="true" />;
  if (name === "route") return <Route className={className} aria-hidden="true" />;
  if (name === "parking") return <CircleParking className={className} aria-hidden="true" />;
  if (name === "id-card") return <IdCard className={className} aria-hidden="true" />;
  if (name === "water") return <GlassWater className={className} aria-hidden="true" />;
  if (name === "user-check") return <UserCheck className={className} aria-hidden="true" />;
  if (name === "landmark") return <Landmark className={className} aria-hidden="true" />;
  if (name === "shopping") return <ShoppingBag className={className} aria-hidden="true" />;
  if (name === "utensils") return <Utensils className={className} aria-hidden="true" />;
  if (name === "bed") return <Bed className={className} aria-hidden="true" />;
  if (name === "moon") return <Moon className={className} aria-hidden="true" />;
  if (name === "x") return <X className={className} aria-hidden="true" />;

  return <Check className={className} aria-hidden="true" />;
}

function TripIncExcList({ items = [], variant }) {
  const isInclusion = variant === "inclusion";
  const iconClassName = isInclusion
    ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
    : "bg-rose-50 text-rose-600 ring-rose-100";

  return (
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <TripIncExcListItem
          key={`${item.label}-${idx}`}
          item={item}
          variant={variant}
          iconClassName={iconClassName}
        />
      ))}
    </ul>
  );
}

function TripIncExcListItem({ item, variant, iconClassName }) {
  const iconName = getItemIconName(item.label, variant, item.hasStructuredIcon);

  return (
    <li className="flex items-start gap-2.5 text-gray-700">
      <span
        className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-1 ${iconClassName}`}
      >
        <TripIncExcIcon name={iconName} className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-normal leading-5 text-gray-800">
          {item.label}
        </span>
        {item.description && (
          <span className="mt-0.5 block text-xs leading-5 text-gray-500">
            {item.description}
          </span>
        )}
      </span>
    </li>
  );
}

function TripIncExcHeading({ variant }) {
  const isInclusion = variant === "inclusion";
  const Icon = isInclusion ? Check : X;
  const label = isInclusion ? "Included" : "Not included";
  const className = isInclusion
    ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
    : "bg-rose-50 text-rose-700 ring-rose-100";

  return (
    <h3 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full ring-1 ${className}`}
      >
        <Icon className="h-3 w-3" aria-hidden="true" />
      </span>
      {label}
    </h3>
  );
}

function TripIncExc({ inclusions = [], exclusions = [], className = "" }) {
  const normalizedInclusions = inclusions
    .map((item) => normalizeItem(item, DEFAULT_INCLUSION_DESCRIPTION))
    .filter(Boolean);
  const normalizedExclusions = exclusions
    .map((item) => normalizeItem(item, DEFAULT_EXCLUSION_DESCRIPTION))
    .filter(Boolean);
  const showInclusionHeading = normalizedInclusions.some(
    (item) => item.hasStructuredIcon,
  );
  const showExclusionHeading = normalizedExclusions.some(
    (item) => item.hasStructuredIcon,
  );

  return (
    <div className={`flex flex-col sm:flex-row gap-2 w-full ${className}`}>
      {/* Inclusions */}
      {normalizedInclusions.length > 0 && (
        <div className="flex-1">
          {showInclusionHeading && <TripIncExcHeading variant="inclusion" />}
          <TripIncExcList items={normalizedInclusions} variant="inclusion" />
        </div>
      )}
      {/* Divider for mobile if both inclusions and exclusions exist */}
      {normalizedInclusions.length > 0 && normalizedExclusions.length > 0 && (
        <div className="block sm:hidden my-1">
          <hr className="border-t border-gray-200" />
        </div>
      )}
      {/* Exclusions */}
      {normalizedExclusions.length > 0 && (
        <div className="flex-1">
          {showExclusionHeading && <TripIncExcHeading variant="exclusion" />}
          <TripIncExcList items={normalizedExclusions} variant="exclusion" />
        </div>
      )}
    </div>
  );
}

export { TripIncExc };
