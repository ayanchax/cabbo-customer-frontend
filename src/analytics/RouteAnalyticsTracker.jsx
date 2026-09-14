import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ANALYTICS_EVENTS } from "./events";
import { useAnalytics } from "./useAnalytics";

function RouteAnalyticsTracker() {
  const location = useLocation();
  const { track } = useAnalytics();

  useEffect(() => {
    track(ANALYTICS_EVENTS.APP_PAGE_VIEWED, {
      path: location.pathname,
      search: location.search,
    });
  }, [location.pathname, location.search, track]);

  return null;
}

export { RouteAnalyticsTracker };
