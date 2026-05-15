import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastProvider, GeographyProvider } from "@/context";
import { ErrorBoundary } from "@/components";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <GeographyProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </GeographyProvider>
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
