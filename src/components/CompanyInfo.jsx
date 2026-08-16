import { useCallback, useEffect, useRef, useState } from "react";
import { Building2, ChevronDown } from "lucide-react";
import { useCompanyQuery } from "@/hooks";
import { APP } from "@/utils";

function getCompanyData(response) {
  return response?.data || response || null;
}

function CompanyInfoCompact({ className = "" }) {
  const { data, isLoading, isError } = useCompanyQuery(true);
  const company = getCompanyData(data);

  if (isLoading || isError || !company?.legal_name) {
    return null;
  }

  return (
    <p className={`mt-4 text-center text-[11px] leading-5 text-gray-400 ${className}`}>
      {APP.name} is operated by{" "}
      <span className="font-medium text-gray-500">{company.legal_name}</span>
    </p>
  );
}

function CompanyDetailsContent({ onReadyToView = () => {} }) {
  const { data, isLoading, isError } = useCompanyQuery(true);
  const company = getCompanyData(data);

  useEffect(() => {
    if (isLoading) return;

    onReadyToView();
  }, [isLoading, onReadyToView]);

  if (isLoading) {
    return (
      <section className=" rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Loading...
        </div>
      </section>
    );
  }

  if (isError || !company) {
    return (
      <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-500">
        Company registration details are unavailable right now.  
      </div>
    );
  }

  const details = [
    { label: "Brand", value: company.brand_name || APP.name },
    { label: "Legal name", value: company.legal_name },
    { label: "CIN", value: company.cin },
    { label: "GSTIN", value: company.gstin },
  ].filter((item) => item.value);

  if (!details.length) {
    return (
      <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-500">
        Company registration details are unavailable right now.
      </div>
    );
  }

  return (
    <dl className="rounded-lg bg-gray-50/70 px-3">
      {details.map((item) => (
        <div
          key={item.label}
          className="flex min-w-0 items-start justify-between gap-3 py-1.5 text-xs"
        >
          <dt className="shrink-0 text-gray-400">{item.label}</dt>
          <dd className="min-w-0 wrap-break-word text-right font-medium text-gray-600 select-none ">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CompanyInfo({ variant = "details", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const companyDetailsRef = useRef(null);
  const shouldScrollToDetailsRef = useRef(false);

  const handleToggle = () => {
    const nextIsOpen = !isOpen;
    shouldScrollToDetailsRef.current = nextIsOpen;
    setIsOpen(nextIsOpen);
  };

  const scrollToDetails = useCallback(() => {
    if (!isOpen || !shouldScrollToDetailsRef.current) return;

    window.requestAnimationFrame(() => {
      const detailsElement = companyDetailsRef.current;
      if (!detailsElement) return;

      const detailsRect = detailsElement.getBoundingClientRect();
      const isFullyVisible =
        detailsRect.top >= 0 && detailsRect.bottom <= window.innerHeight;

      if (isFullyVisible) {
        shouldScrollToDetailsRef.current = false;
        return;
      }

      detailsElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      shouldScrollToDetailsRef.current = false;
    });
  }, [isOpen]);

  if (variant === "compact") {
    return <CompanyInfoCompact className={className} />;
  }

  return (
    <section
      className={`mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${className}`}
      aria-label="Company details"
    >
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary/15"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-100">
            <Building2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-gray-950">
              Company details
            </span>
            <span className="mt-1 block text-xs leading-5 text-gray-500">
              Legal identity for {APP.name}.
            </span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div ref={companyDetailsRef} className="mt-1 border-t border-gray-100 pt-3">
          <CompanyDetailsContent onReadyToView={scrollToDetails} />
        </div>
      )}
    </section>
  );
}

export { CompanyInfo };
