// History state survives a page refresh; accept context only for this customer/booking.
export function restoreSupportContext(recovery, owner, reference) {
  if (!reference || recovery?.owner !== owner || recovery.temp_trip_id !== reference) return null;
  const context = recovery.supportContext;
  if (!context?.origin || typeof context.tripType !== "string" || !context.tripType) return null;
  return { origin: context.origin, tripType: context.tripType, tripLabel: context.tripLabel };
}
