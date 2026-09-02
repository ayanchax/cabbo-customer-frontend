import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastProvider, GeographyProvider } from "@/context";
import { ErrorBoundary } from "@/components";
import { OverlayProvider } from "@/context";
import { queryClient } from "@/api/queryClient";
import { PostHogProvider } from '@posthog/react'
import { isPostHogEnabled } from "@/analytics";
const options = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  autocapture: false,
  capture_pageview: false,
  defaults: '2026-05-30',
  disable_session_recording: true,
  disabled: !isPostHogEnabled,
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <ToastProvider>
          <GeographyProvider>
            <ErrorBoundary>
              <PostHogProvider
                apiKey={import.meta.env.VITE_POSTHOG_PROJECT_TOKEN || "disabled"}
                options={options}
              >
                <App />
              </PostHogProvider>
            </ErrorBoundary>
          </GeographyProvider>
        </ToastProvider>
      </OverlayProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
