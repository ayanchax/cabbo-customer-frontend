// Restore only the expected trip route, with the state its page requires.
export function resolveBookingReturn(returnTo, tripTypeRoute, homeRoute, requiresDropoff) {
  const state = returnTo?.state;
  if (returnTo?.pathname !== tripTypeRoute || !state?.pickup ||
      (requiresDropoff && (!state.dropoff || !state.trip_type))) {
    return { to: homeRoute, options: { replace: true } };
  }
  return {
    to: { pathname: tripTypeRoute, search: returnTo.search || "", hash: returnTo.hash || "" },
    options: { replace: true, state },
  };
}
