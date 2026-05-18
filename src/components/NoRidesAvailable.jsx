import React from "react";
import {EmptyState} from "@/components";

// Example SVG illustration (replace with your own or use a Lottie animation)
const NoRidesSVG = (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="96" height="96" rx="24" fill="#F3F4F6"/>
    <path d="M28 68c0-8 8-12 20-12s20 4 20 12" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"/>
    <rect x="36" y="36" width="24" height="16" rx="8" fill="#E5E7EB"/>
    <circle cx="44" cy="60" r="4" fill="#A3A3A3"/>
    <circle cx="52" cy="60" r="4" fill="#A3A3A3"/>
    <path d="M40 44h16" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"/>
    <path d="M48 36v8" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const NoRidesAvailable = ({ onRetry }) => (
  <EmptyState
    illustration={NoRidesSVG}
    title="No rides available"
    message="We couldn't find any rides for your selected route. Please try a different pickup or drop location."
    action={
      onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 rounded-lg bg-primary text-white font-medium shadow hover:bg-primary/90 transition"
        >
          Try Again
        </button>
      )
    }
  />
);

export default NoRidesAvailable;
