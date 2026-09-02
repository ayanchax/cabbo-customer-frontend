import { useCallback } from "react";
import { usePostHog } from "@posthog/react";

 
export const isPostHogEnabled =
  Boolean(import.meta.env.VITE_POSTHOG_PROJECT_TOKEN) &&
  Boolean(import.meta.env.VITE_POSTHOG_HOST) &&
  import.meta.env.VITE_POSTHOG_ENABLED === "true";

function cleanProperties(properties = {}) {
  return Object.entries(properties).reduce((cleaned, [key, value]) => {
    if (value === null || value === undefined || value === "") return cleaned;

    cleaned[key] = value;
    return cleaned;
  }, {});
}

export function useAnalytics() {
  const posthog = usePostHog();

  const track = useCallback(
    (eventName, properties = {}) => {
      try {
        if (!eventName || !isPostHogEnabled || !posthog) return;

        posthog.capture(eventName, cleanProperties(properties));
      } catch (error) {
        if (isPostHogEnabled) {
          console.warn("PostHog capture failed", error);
        }
      }
    },
    [posthog],
  );

  const identify = useCallback(
    (distinctId, properties = {}) => {
      if (!distinctId || !isPostHogEnabled || !posthog) return;

      posthog.identify(distinctId, cleanProperties(properties));
    },
    [posthog],
  );

  const reset = useCallback(() => {
    if (!isPostHogEnabled || !posthog) return;

    posthog.reset();
  }, [posthog]);

  return {
    identify,
    reset,
    track,
  };
}
