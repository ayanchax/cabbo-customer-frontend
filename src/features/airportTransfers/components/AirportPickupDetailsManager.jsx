import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  IdCard,
  LoaderCircle,
  Pencil,
  Plane,
  Signpost,
  X,
} from "lucide-react";
import { TogglePreference } from "@/components";
import { useUIElement } from "@/hooks";

const EMPTY_DETAILS = {
  flight_number: null,
  terminal_number: null,
  placard_required: false,
  placard_name: null,
};

const normalizeTextValue = (value) => value?.trim() || null;

function AirportPickupDetailsManager({
  id = "airportPickupDetails",
  value = EMPTY_DETAILS,
  read = false,
  write = false,
  isSaving = false,
  // eslint-disable-next-line no-unused-vars
  isEditing: externalIsEditing = false,
  onEdit = () => {},
  onChange = () => {},
  onSave = () => {},
  onCancel = () => {},
  className = "",
  helperTextLabel = "",
  hideEmptyReadOnlyFields = false,
}) {
  const [isEditing, setIsEditing] = useState(write && !read);
  const [draft, setDraft] = useState({
    ...EMPTY_DETAILS,
  });
  const rootRef = useRef(null);
  const placardNameInputRef = useRef(null);
  const flightNumberInputRef = useRef(null);


  const showInputs = write && (!read || isEditing);
  const canTogglePlacard = write && !read;
  const normalizedValue = {
    ...EMPTY_DETAILS,
    ...value,
  };
  const activeValue = read && write && isEditing ? draft : normalizedValue;
  const isDirty =
    normalizeTextValue(draft.flight_number) !==
      normalizeTextValue(normalizedValue.flight_number) ||
    normalizeTextValue(draft.terminal_number) !==
      normalizeTextValue(normalizedValue.terminal_number) ||
    normalizeTextValue(draft.placard_name) !==
      normalizeTextValue(normalizedValue.placard_name);
  const previousPlacardRequiredRef = useRef(
    Boolean(activeValue.placard_required)
  );
  const { focusOnElement } = useUIElement();
  // Focus root element when label[for=id] is clicked from parent
  useEffect(() => {
    if (!id) return;
    const label = document.querySelector(`label[for='${id}']`);

    if (!label) return;
    const handler = () => {
      focusOnElement(rootRef);
    };
    label.addEventListener("click", handler);
    return () => {
      label.removeEventListener("click", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const placardWasEnabled = previousPlacardRequiredRef.current;
    const placardIsEnabled = Boolean(activeValue.placard_required);

    if (!placardWasEnabled && placardIsEnabled && showInputs) {
      placardNameInputRef.current?.focus();
    }

    previousPlacardRequiredRef.current = placardIsEnabled;
  }, [activeValue.placard_required, showInputs]);

  //Use effect to focus flight number input when component switches from read only to editing mode
  useEffect(() => {
    if (isEditing && read && write) {
      flightNumberInputRef.current?.focus();
    }
  }, [isEditing, read, write]);

  if (!read && !write) return null;

  const placardNameMissing =
    activeValue.placard_required && !activeValue.placard_name?.trim();

  const updateField = (field, fieldValue) => {
    const nextDraft = {
      ...activeValue,
      [field]: fieldValue,
    };

    if (field === "placard_required" && !fieldValue) {
      nextDraft.placard_name = null;
    }

    if (read && write) {
      // If in read/write mode, update the draft state
      setDraft(nextDraft);
    } else {
      // If in read-only or write-only mode, call onChange directly to parent.
      onChange?.(nextDraft);
    }
  };

  const handleEdit = () => {
    setDraft({
      ...EMPTY_DETAILS,
      ...value,
    });
    setIsEditing(true);
    onEdit?.();
  };

  const handleCancel = () => {
    setDraft({
      ...EMPTY_DETAILS,
      ...value,
    });
    setIsEditing(false);
    onCancel?.();
  };

  const handleSave = async () => {
    if (!isDirty || placardNameMissing) return;
    await onSave?.(draft);
    setIsEditing(false);
  };

  const helperText =
    helperTextLabel ||
    (read && write
      ? "Helps your driver coordinate your airport pickup."
      : "Providing your flight number and terminal helps your driver track your arrival for a smooth pickup.");

  const inputClass =
    "w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100";

  const fields = [
    {
      id: "flight-number",
      field: "flight_number",
      label: "Flight number",
      placeholder: "e.g. AI 123",
      icon: Plane,
    },
    {
      id: "terminal-number",
      field: "terminal_number",
      label: "Terminal",
      placeholder: "e.g. T1",
      icon: Signpost,
    },
  ];

  if (activeValue.placard_required) {
    fields.push({
      id: "placard-name",
      field: "placard_name",
      label: "Placard name",
      placeholder: "Name shown at arrivals",
      icon: IdCard,
    });
  }

  const displayFields =
    read && !write && hideEmptyReadOnlyFields
      ? fields.filter((fieldConfig) => {
          const fieldValue = activeValue[fieldConfig.field];
          return typeof fieldValue === "string"
            ? fieldValue.trim().length > 0
            : Boolean(fieldValue);
        })
      : fields;

    if (read && !write && hideEmptyReadOnlyFields && displayFields.length === 0) {
      return null;
    }

  const getRef= (field) => {
    if (field === "flight_number") return flightNumberInputRef;
    if (field === "placard_name") return placardNameInputRef;
    return null;
  }

  return (
    <section
      ref={rootRef}
      id={id}
      tabIndex={0}
      className={`w-full rounded-lg border border-gray-200 bg-gray-50/80 p-3 shadow-sm sm:p-4 ${className}`}
      aria-labelledby="airport-pickup-details-manager-title"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="airport-pickup-details-manager-title"
            className="flex items-center gap-2 text-sm font-semibold text-gray-800 sm:text-base"
          >
            <Plane className="h-4 w-4 text-primary" aria-hidden="true" />
            Arrival details
          </h2>
          <p className="mt-0.5 text-xs leading-4 text-gray-500">
           {helperText}
          </p>
        </div>

        {read && write && !isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Edit arrival details"
            title="Edit arrival details"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 xs:grid-cols-2">
        {displayFields.map((fieldConfig) => {
          const Icon = fieldConfig.icon;
          const fieldValue = activeValue[fieldConfig.field];
          const hasValue =
            typeof fieldValue === "string"
              ? fieldValue.trim().length > 0
              : Boolean(fieldValue);

          return (
            <div
              key={fieldConfig.id}
              className={`min-w-0 rounded-md border border-gray-100 bg-white p-3 ${
                fieldConfig.field === "placard_name" ? "xs:col-span-2" : ""
              }`}
            >
              <label htmlFor={`airport-manager-${fieldConfig.id}`} className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500 sm:text-sm">
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {fieldConfig.label}
                {fieldConfig.field === "placard_name" && showInputs && (
                  <span className="text-primary">*</span>
                )}
              </label>

              {showInputs ? (
                <>
                  <input
                    id={`airport-manager-${fieldConfig.id}`}
                    type="text"
                    value={fieldValue || ""}
                    ref={getRef(fieldConfig.field)}
                    onChange={(event) =>
                      updateField(fieldConfig.field, event.target.value || null)
                    }
                    placeholder={fieldConfig.placeholder}
                    autoComplete={
                      fieldConfig.field === "placard_name" ? "name" : "off" // Suggest the user's name for the placard name field
                    }
                    disabled={isSaving}
                    required={fieldConfig.field === "placard_name"}
                    className={`${inputClass} ${
                      fieldConfig.field === "placard_name" && placardNameMissing
                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                        : ""
                    }`}
                  />

                  {fieldConfig.field === "placard_name" && (
                    <span className="mt-1.5 block text-[11px] leading-4 text-gray-500 sm:text-xs">
                      {fieldValue && fieldValue.trim() ? (
                        <strong>{fieldValue}</strong>
                      ) : (
                        "This"
                      )}{" "}
                      is the name your driver will display at arrivals to
                      identify you or your guest.
                    </span>
                  )}
                </>
              ) : (
                <p
                  className={`min-h-5 wrap-break-word text-sm ${
                    hasValue
                      ? "font-semibold text-gray-800"
                      : "font-medium text-gray-400"
                  }`}
                >
                  {hasValue ? fieldValue : "Not added"}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {canTogglePlacard && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          <TogglePreference
            id="airport-manager-placard-required"
            title="Meet with a name board"
            description="Your driver can meet you or your guest at arrivals. A nominal placard charge may apply."
            icon={IdCard}
            checked={Boolean(activeValue.placard_required)}
            onChange={(checked) => updateField("placard_required", checked)}
            disabled={isSaving}
            className="bg-white"
          />
        </div>
      )}

      {read && write && isEditing && (
        <div className="mt-3 flex justify-end gap-2 border-t border-gray-200 pt-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty || placardNameMissing}
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <LoaderCircle
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Check className="h-4 w-4" aria-hidden="true" />
            )}
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </section>
  );
}

export { AirportPickupDetailsManager };
