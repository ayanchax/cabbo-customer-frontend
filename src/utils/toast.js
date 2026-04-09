// This won't work if we do not have a 'react-hot-toast Toaster wrapper' in the App.jsx
import { toast } from "react-hot-toast";
import React from "react";
import { X } from "lucide-react";
export const DEFAULT_TOAST_OPTIONS = {
    duration: 3000,
    maxToasts: 1,
    // pauseOnHover: false, React hot toast default is true, but we want to disable it to ensure consistent behavior across all toast types, especially for error messages that should disappear after a fixed duration regardless of user interaction.
    dismissable: false,
    dismiss: {
        icon: React.createElement(X, { size: 16, "aria-hidden": true }, null),
        ariaLabel: "Dismiss notification",
        text: "Dismiss",
        iconOnly: true,
    },
    style: {
        borderRadius: "10px",
        fontSize: "14px",
        padding: "12px 16px",
        minWidth: "260px",
        maxWidth: "90vw",
    },
    success: {
        style: {
            background: "#16a34a", // Industry standard tone used by platforms like Uber Dashboards, Stripe, and Slack
            color: "#fff",
        },
    },
    error: {
        style: {
            background: "#dc2626", // Industry standard tone used by platforms like Uber Dashboards, Stripe, and Slack
            color: "#fff",
        },
    },
    loading: {
        style: {
            background: "#2563eb", // Industry standard tone used by platforms like Uber Dashboards, Stripe, and Slack
            color: "#fff",
        },
    }
}
let activeToasts = [];
export const TOAST_TYPES = {
    SUCCESS: "success",
    ERROR: "error",
    LOADING: "loading",
    CUSTOM: "custom",
    DEFAULT: "default"
}

const getToastId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now() + Math.random());

const withDismissElement = (message, id, dismissOpts) => {
    const dismissText = dismissOpts?.text || DEFAULT_TOAST_OPTIONS.dismiss.text || "Dismiss";
    const dismissIcon = dismissOpts?.icon || DEFAULT_TOAST_OPTIONS.dismiss.icon || React.createElement(X, { size: 16, "aria-hidden": true }, null);
    const ariaLabel = dismissOpts?.ariaLabel || DEFAULT_TOAST_OPTIONS.dismiss.ariaLabel || "Dismiss notification";
    const iconOnly = dismissOpts?.iconOnly ?? DEFAULT_TOAST_OPTIONS.dismiss.iconOnly;
    return React.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 10 } },
        React.createElement("span", { style: { flex: 1 } }, message),
        React.createElement(
            "button",
            {
                type: "button",
                ariaLabel: ariaLabel,
                onClick: () => dismissToast(id),
                style: {
                    opacity: 0.8,
                    border: "none",
                    background: "transparent",
                    color: "inherit",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                },
            },
            React.createElement(dismissIcon.type, { ...dismissIcon.props, "aria-hidden": true }, null),
            !iconOnly && React.createElement("span", { style: { marginLeft: 4 } }, dismissText)
        )
    );
}


const getTypeDefaults = (type) => {
    if (type === TOAST_TYPES.SUCCESS) return DEFAULT_TOAST_OPTIONS.success;
    if (type === TOAST_TYPES.ERROR) return DEFAULT_TOAST_OPTIONS.error;
    if (type === TOAST_TYPES.LOADING) return DEFAULT_TOAST_OPTIONS.loading;
    return {};
};
//Example usage: 
// showToast("This is a success message", "success");
// showToast("This is an error message", "error");
// showToast("This is a default message");
// showToast("Custom duration and style", "success", { duration: 5000, style: { background: "#333", color: "#fff" } });
// showToast("This is a custom toast with no predefined styles", "custom", { style: { background: "#ff69b4", color: "#fff" } });
// showToast("This toast cannot be dismissed by the user", "error", { dismissable: false });
// showToast("This toast has a custom dismiss button", "success", { dismiss: { text: "Close", icon: <YourCustomIcon />, ariaLabel: "Close notification", iconOnly: false } });
export const showToast = (message, type = TOAST_TYPES.DEFAULT, options = {}) => {
    // Ensure we don't exceed maxToasts by dismissing the oldest toast if necessary
    const maxToasts = options.maxToasts || DEFAULT_TOAST_OPTIONS.maxToasts;
    if (activeToasts.length >= maxToasts) {
        const oldest = activeToasts.shift();
        toast.dismiss(oldest);
    }

    const id = options.id || getToastId();
    const { dismissable: canDismissOverride, dismiss: dismissOpts, ...userOptions } = options;
    const dismissable = canDismissOverride || dismissOpts ? true : DEFAULT_TOAST_OPTIONS.dismissable;
    const typeDefaults = getTypeDefaults(type);

    const toastOptions = {
        ...DEFAULT_TOAST_OPTIONS,
        ...typeDefaults,
        ...userOptions,
        id,
        style: {
            ...DEFAULT_TOAST_OPTIONS.style,
            ...typeDefaults.style,
            ...userOptions.style,
        },
        onClose: () => {
            activeToasts = activeToasts.filter((t) => t !== id);
            userOptions.onClose?.();
        },
    };

    const content = dismissable ? withDismissElement(message, id, options?.dismiss) : message;

    if (type === TOAST_TYPES.SUCCESS) {
        toast.success(content, toastOptions);
    } else if (type === TOAST_TYPES.ERROR) {
        toast.error(content, toastOptions);
    } else if (type === TOAST_TYPES.LOADING) {
        toast.loading(content, toastOptions);
    } else if (type === TOAST_TYPES.CUSTOM) {
        toast.custom(content, toastOptions);
    } else {
        toast(content, toastOptions);
    }

    activeToasts.push(id);
    return id;
};

export const dismissToast = (id) => {
    toast.dismiss(id);
    activeToasts = activeToasts.filter((t) => t !== id);
}