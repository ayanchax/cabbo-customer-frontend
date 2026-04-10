import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastProvider, GeographyProvider } from "@/context";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <GeographyProvider>
          <App />
        </GeographyProvider>
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
