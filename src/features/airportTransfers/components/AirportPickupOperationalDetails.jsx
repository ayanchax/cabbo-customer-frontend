import React from "react";
import {
  Check,
  IdCard,
  LoaderCircle,
  Pencil,
  Plane,
  Signpost,
  X,
} from "lucide-react";

function AirportPickupOperationalDetails({
  value = {
    flight_number: null,
    terminal_number: null,
    placard_required: false,
    placard_name: null,
  },
  isEditing = false,
  isSaving = false,
  onChange,
  onEdit,
  onSave,
  onCancel,
  className = "",
}) {
  const updateField = (field, fieldValue) => {
    onChange?.({
      ...value,
      [field]: fieldValue,
    });
  };

  const inputClass =
    "w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100";

  const details = [
    {
      id: "flight-number",
      field: "flight_number",
      label: "Flight number",
      value: value.flight_number || "",
      placeholder: "e.g. AI 123",
      icon: Plane,
    },
    {
      id: "terminal-number",
      field: "terminal_number",
      label: "Terminal",
      value: value.terminal_number || "",
      placeholder: "e.g. T1",
      icon: Signpost,
    },
  ];

  if (value.placard_required) {
    details.push({
      id: "placard-name",
      field: "placard_name",
      label: "Placard name",
      value: value.placard_name || "",
      placeholder: "Name shown at arrivals",
      icon: IdCard,
    });
  }

  return (
    <section
      className={`w-full rounded-lg border border-gray-200 bg-gray-50/80 p-3 shadow-sm sm:p-4 ${className}`}
      aria-labelledby="airport-pickup-operational-details-title"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="airport-pickup-operational-details-title"
            className="flex items-center gap-2 text-sm font-semibold text-gray-800 sm:text-base"
          >
            <Plane className="h-4 w-4 text-primary" aria-hidden="true" />
            Arrival details
          </h2>
          <p className="mt-0.5 text-xs leading-4 text-gray-500">
            Used by your driver to coordinate your airport pickup.
          </p>
        </div>

        {!isEditing && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="cursor-pointer flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Edit arrival details"
            title="Edit arrival details"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 xs:grid-cols-2">
        {details.map((detail) => {
          const Icon = detail.icon;
          const hasValue =
            typeof detail.value === "string"
              ? detail.value.trim().length > 0
              : Boolean(detail.value);

          return (
            <div
              key={detail.id}
              className={`min-w-0 rounded-md border border-gray-100 bg-white p-3 ${
                detail.field === "placard_name" ? "xs:col-span-2" : ""
              }`}
            >
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {detail.label}
              </div>

              {isEditing ? (
                <input
                  id={`airport-${detail.id}`}
                  type="text"
                  value={detail.value || ""}
                  onChange={(event) =>
                    updateField(detail.field, event.target.value || null)
                  }
                  placeholder={detail.placeholder}
                  autoComplete={detail.field === "placard_name" ? "name" : "off"}
                  disabled={isSaving}
                  className={inputClass}
                />
              ) : (
                <p
                  className={`min-h-5 wrap-break-word text-sm ${
                    hasValue
                      ? "font-semibold text-gray-800"
                      : "font-medium text-gray-400"
                  }`}
                >
                  {hasValue ? detail.value : "Not added"}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {isEditing && (
        <div className="mt-3 flex justify-end gap-2 border-t border-gray-200 pt-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="cursor-pointer inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="cursor-pointer inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <LoaderCircle
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Check className="h-4 w-4" aria-hidden="true" />
            )}
            {isSaving ? "Saving" : "Save"}
          </button>
        </div>
      )}
    </section>
  );
}

export { AirportPickupOperationalDetails };
