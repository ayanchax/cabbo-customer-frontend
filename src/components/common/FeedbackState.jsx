import React from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";

const VARIANT_CONFIG = {
  error: {
    icon: AlertCircle,
    iconClassName: "bg-red-50 text-red-600 ring-red-100",
    titleClassName: "text-gray-950",
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: "bg-amber-50 text-amber-600 ring-amber-100",
    titleClassName: "text-gray-950",
  },
  info: {
    icon: Info,
    iconClassName: "bg-blue-50 text-primary ring-blue-100",
    titleClassName: "text-gray-950",
  },
  success: {
    icon: CheckCircle2,
    iconClassName: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    titleClassName: "text-gray-950",
  },
};

function FeedbackState({
  variant = "error",
  title,
  message,
  primaryAction = null,
  secondaryAction = null,
  className = "",
}) {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.error;
  const Icon = config.icon;

  return (
    <div
      className={`mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 py-10 text-center ${className}`}
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
    >
      <div
        className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full ring-8 ${config.iconClassName}`}
      >
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>

      {title && (
        <h1 className={`text-xl font-semibold sm:text-2xl ${config.titleClassName}`}>
          {title}
        </h1>
      )}

      {message && (
        <p className="mt-3 max-w-md text-sm leading-6 text-gray-600 sm:text-base">
          {message}
        </p>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
          {secondaryAction}
          {primaryAction}
        </div>
      )}
    </div>
  );
}

export { FeedbackState };
