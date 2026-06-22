import { useEffect, useMemo, useState } from "react";
import {
  Check,
  GripVertical,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  Route,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import {
  useLocationByPlaceIdQuery,
  useLocationSearchQuery,
  useRecentSuggestions,
} from "@/hooks";

const getLocationKey = (location = {}) => {
  if (location.place_id) return `place:${location.place_id}`;
  if (location.lat != null && location.lng != null) {
    return `coords:${location.lat}:${location.lng}`;
  }
  return `name:${location.display_name || ""}:${location.address || ""}`;
};

function OutstationHopManager({
  value = [],
  onChange,
  maxHops = 0,
  origin,
  destination,
  coordinates,
  disabled = false,
  allowEdit = false,
  collapseCommittedStops = false,
  className = "",
}) {
  const [editorIndex, setEditorIndex] = useState(null);
  const [isManagingStops, setIsManagingStops] = useState(false);
  const [query, setQuery] = useState("");
  const [sessionToken, setSessionToken] = useState(() => crypto.randomUUID());
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [pendingSelection, setPendingSelection] = useState(null);

  const normalizedMaxHops = Number.isFinite(Number(maxHops))
    ? Math.max(0, Number(maxHops))
    : 0;
  const isAdding = editorIndex === "new";
  const editorOpen = editorIndex !== null;
  const canAdd = value.length < normalizedMaxHops;
  const activeQuery = query.trim();

  const {
    data: apiSuggestions = [],
    isFetching,
    isError: isSearchError,
  } = useLocationSearchQuery(activeQuery, coordinates, sessionToken);
  const { recentSuggestions, cacheSuggestionToLocalStorage } =
    useRecentSuggestions();
  const { data: enrichedLocation, isError: isEnrichmentError } =
    useLocationByPlaceIdQuery(
      pendingSelection?.placeId,
      pendingSelection?.sessionToken,
    );

  const hasActiveSearch = activeQuery.length >= 2;
  const suggestions = useMemo(() => {
    if (!hasActiveSearch || isSearchError || apiSuggestions.length === 0) {
      return recentSuggestions;
    }
    return apiSuggestions;
  }, [apiSuggestions, hasActiveSearch, isSearchError, recentSuggestions]);

  const closeEditor = () => {
    setEditorIndex(null);
    setQuery("");
    setError("");
    setIsResolving(false);
  };

  const openAddEditor = () => {
    setEditorIndex("new");
    setQuery("");
    setError("");
  };

  const openEditEditor = (index) => {
    setIsManagingStops(true);
    setEditorIndex(index);
    setQuery(value[index]?.display_name || "");
    setError("");
  };

  const applyLocation = (location, targetEditorIndex) => {
    const locationKey = getLocationKey(location);
    const duplicateKeys = new Set(
      [origin, destination].filter(Boolean).map(getLocationKey),
    );

    value.forEach((hop, index) => {
      if (index !== targetEditorIndex) {
        duplicateKeys.add(getLocationKey(hop));
      }
    });

    if (duplicateKeys.has(locationKey)) {
      setError("This location is already part of your route.");
      return false;
    }

    if (targetEditorIndex === "new") {
      if (!canAdd) {
        setError(`You can add up to ${normalizedMaxHops} stops.`);
        return false;
      }
      onChange?.([...value, location]);
    } else {
      onChange?.(
        value.map((hop, index) =>
          index === targetEditorIndex ? location : hop,
        ),
      );
    }

    cacheSuggestionToLocalStorage(location);
    setSessionToken(crypto.randomUUID());
    closeEditor();
    return true;
  };

  const commitLocation = (suggestion) => {
    if (isResolving) return;

    setError("");

    if (suggestion.lat != null) {
      applyLocation(suggestion, editorIndex);
      return;
    }

    if (!suggestion.place_id) {
      setError("We couldn't load this location. Please choose another result.");
      return;
    }

    setIsResolving(true);
    setPendingSelection({
      placeId: suggestion.place_id,
      sessionToken,
      targetEditorIndex: editorIndex,
    });
  };

  useEffect(() => {
    if (!pendingSelection || !enrichedLocation) return;

    applyLocation(enrichedLocation, pendingSelection.targetEditorIndex);
    setPendingSelection(null);
    setIsResolving(false);
    // applyLocation intentionally uses the latest controlled value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrichedLocation, pendingSelection]);

  useEffect(() => {
    if (!pendingSelection || !isEnrichmentError) return;

    setError("We couldn't add this stop. Please try again.");
    setPendingSelection(null);
    setIsResolving(false);
  }, [isEnrichmentError, pendingSelection]);

  const removeHop = (index) => {
    const nextHops = value.filter((_, hopIndex) => hopIndex !== index);
    onChange?.(nextHops);
    if (nextHops.length === 0) setIsManagingStops(false);
    if (editorIndex === index) closeEditor();
  };

  const moveHop = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= value.length) return;

    const nextHops = [...value];
    [nextHops[index], nextHops[targetIndex]] = [
      nextHops[targetIndex],
      nextHops[index],
    ];
    onChange?.(nextHops);
  };

  const handleDragStart = (event, index) => {
    if (disabled || editorOpen) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggedIndex(index);
  };

  const handleDragMove = (event) => {
    if (draggedIndex === null) return;

    const targetRow = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest("[data-hop-index]");
    const targetIndex = Number(targetRow?.dataset.hopIndex);

    if (
      !Number.isInteger(targetIndex) ||
      targetIndex === draggedIndex ||
      targetIndex < 0 ||
      targetIndex >= value.length
    ) {
      return;
    }

    const nextHops = [...value];
    const [draggedHop] = nextHops.splice(draggedIndex, 1);
    nextHops.splice(targetIndex, 0, draggedHop);
    onChange?.(nextHops);
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDraggedIndex(null);
  };

  const handleReorderKeyDown = (event, index) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

    event.preventDefault();
    moveHop(index, event.key === "ArrowUp" ? -1 : 1);
  };

  return (
    <section
      className={`border-y border-gray-200 py-4 ${className}`}
      aria-labelledby="outstation-stops-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="outstation-stops-title"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 md:text-base"
          >
            <Route
              className="h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            Stops along the way
          </h2>

          {!canAdd && normalizedMaxHops > 0 ? (
            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              You have added the maximum number of stops.
            </p>
          ) : (
            <>
              <p className="block md:hidden mt-0.5 text-xs text-gray-500 sm:text-sm">
                { value.length ===0 ?`Optional. Add up to ${normalizedMaxHops} stops.` : `You have added ${value.length} stops.`}
              </p>
              <p className="hidden md:block mt-0.5 text-xs text-gray-500 sm:text-sm">
                { value.length ===0 ?`Optional. Add up to ${normalizedMaxHops} stops before your destination.` : `You have added ${value.length} stops before your destination.`}
              </p>
            </>
          )}
        </div>

        {!editorOpen && (
          <div className="flex shrink-0 items-center gap-2">
            {collapseCommittedStops && value.length > 0 && (
              <button
                type="button"
                onClick={() => setIsManagingStops((current) => !current)}
                disabled={disabled}
                className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isManagingStops
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                }`}
                aria-label={
                  isManagingStops
                    ? "Finish managing stops"
                    : `Manage ${value.length} stops`
                }
                title={isManagingStops ? "Done" : "Manage stops"}
              >
                {isManagingStops ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <>
                    <Settings2 className="h-4 w-4" aria-hidden="true" />
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold leading-none text-white">
                      {value.length}
                    </span>
                  </>
                )}
              </button>
            )}
            {canAdd && (
              <button
                type="button"
                onClick={openAddEditor}
                disabled={disabled}
                className="flex h-9 cursor-pointer items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2.5 text-xs font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {value.length === 0 ? "Add stop" : "Add another stop"}
              </button>
            )}
          </div>
        )}
      </div>

      {value.length > 0 && (!collapseCommittedStops || isManagingStops) && (
        <ol className="mt-3 space-y-2">
          {value.map((hop, index) => (
            <li
              key={getLocationKey(hop)}
              data-hop-index={index}
              className={`flex min-h-14 items-center gap-2 rounded-md border bg-white px-2 py-2 transition ${
                draggedIndex === index
                  ? "border-primary shadow-md"
                  : "border-gray-200"
              }`}
            >
              {value.length > 1 && (
                <button
                  type="button"
                  onPointerDown={(event) => handleDragStart(event, index)}
                  onPointerMove={handleDragMove}
                  onPointerUp={handleDragEnd}
                  onPointerCancel={handleDragEnd}
                  onKeyDown={(event) => handleReorderKeyDown(event, index)}
                  disabled={disabled || editorOpen}
                  className="flex h-10 w-8 shrink-0 touch-none cursor-grab items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={`Reorder stop ${index + 1}. Drag, or use the up and down arrow keys.`}
                  title="Drag to reorder"
                >
                  <GripVertical className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <MapPin
                className="h-4 w-4 shrink-0 text-gray-400"
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">
                  {hop.display_name}
                </p>
                {hop.address && (
                  <p className="truncate text-xs text-gray-500">
                    {hop.address}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center">
                {allowEdit && (
                  <button
                    type="button"
                    onClick={() => openEditEditor(index)}
                    disabled={disabled || editorOpen}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Edit stop ${index + 1}`}
                    title="Edit stop"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeHop(index)}
                  disabled={disabled || editorOpen}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Remove stop ${index + 1}`}
                  title="Remove stop"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      {editorOpen && (
        <div className="mt-3 rounded-md border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center gap-2">
            <MapPin
              className="h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError("");
              }}
              placeholder={
                isAdding ? "Search for a stop" : "Search a new location"
              }
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              aria-label={isAdding ? "Search for a stop" : "Edit stop"}
            />
            {(isFetching || isResolving) && (
              <LoaderCircle
                className="h-4 w-4 shrink-0 animate-spin text-primary"
                aria-label="Loading locations"
              />
            )}
            <button
              type="button"
              onClick={closeEditor}
              disabled={isResolving}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-500 transition hover:bg-white"
              aria-label="Close stop editor"
              title="Cancel"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {error && (
            <p className="mt-2 text-xs text-red-600" role="status">
              {error}
            </p>
          )}

          {suggestions.length > 0 && (
            <div className="mt-2 max-h-56 overflow-y-auto border-t border-primary/15 pt-2 scrollbar-hide">
              {suggestions.map((suggestion) => (
                <button
                  type="button"
                  key={getLocationKey(suggestion)}
                  onClick={() => commitLocation(suggestion)}
                  disabled={isResolving}
                  className="flex min-h-11 w-full cursor-pointer items-start gap-2 rounded-md px-2 py-2 text-left transition hover:bg-white disabled:cursor-wait disabled:opacity-60"
                >
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-gray-800">
                      {suggestion.display_name}
                    </span>
                    {suggestion.address && (
                      <span className="block truncate text-xs text-gray-500">
                        {suggestion.address}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}

          {hasActiveSearch &&
            !isFetching &&
            !isResolving &&
            suggestions.length === 0 && (
              <p className="mt-2 text-xs text-gray-500">
                No matching locations found.
              </p>
            )}
        </div>
      )}
    </section>
  );
}

export { OutstationHopManager };
