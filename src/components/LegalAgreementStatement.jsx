import React from "react";
import { ROUTES } from "@/utils";
function LegalAgreementStatement({ className = "" }) {
  return (
    <div className={`mt-4 text-center text-xs text-gray-500 ${className}`}>
      By continuing, you agree to our{" "}
      <a
        href={`${ROUTES.LEGAL}/terms-of-service`}
        className="text-primary underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms of Service
      </a>{" "}
      and{" "}
      <a
        href={`${ROUTES.LEGAL}/privacy-policy`}
        className="text-primary underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </a>
    </div>
  );
}

export { LegalAgreementStatement };
