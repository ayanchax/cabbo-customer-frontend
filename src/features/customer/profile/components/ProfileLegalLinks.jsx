import React from "react";
import {
  ChevronRight,
  CircleHelp,
  CreditCard,
  FileCheck2,
  LifeBuoy,
  ReceiptText,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLegalPages } from "@/hooks";
import { ROUTES } from "@/utils";

const PAGE_META = {
  "help-support": {
    icon: LifeBuoy,
    helper: "Call or message Cabbo support.",
    iconClassName: "bg-blue-50 text-primary ring-blue-100",
  },
  "terms-of-service": {
    icon: FileCheck2,
    helper: "Account, booking, and service terms.",
    iconClassName: "bg-slate-50 text-slate-600 ring-slate-100",
  },
  "privacy-policy": {
    icon: ShieldCheck,
    helper: "How Cabbo handles your data.",
    iconClassName: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  "cancellation-refund-policy": {
    icon: CreditCard,
    helper: "Cancellation windows and refunds.",
    iconClassName: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  "fare-charges-policy": {
    icon: ReceiptText,
    helper: "Fares, extras, and pay-to-driver items.",
    iconClassName: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  },
  "safety-contact-grievance": {
    icon: CircleHelp,
    helper: "Safety guidance and escalation contacts.",
    iconClassName: "bg-rose-50 text-rose-700 ring-rose-100",
  },
};

function ProfileLegalLinks() {
  const { data: pages = [], isLoading, isError } = useLegalPages();

  if (isLoading) {
    return (
      <section className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Loading account links...
        </div>
      </section>
    );
  }

  if (isError || !pages.length) {
    return null;
  }

  return (
    <section className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary ring-1 ring-blue-100">
          <Scale className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-gray-950">
            Support and policies
          </h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Everything important about your account, rides, fares, refunds, and
            support.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-1 md:gap-0 md:divide-y md:divide-gray-100 md:rounded-xl md:border md:border-gray-100 md:bg-white">
        {pages.map((page) => {
          const meta = PAGE_META[page.slug] || {};
          const Icon = meta.icon || FileCheck2;

          return (
            <Link
              key={page.slug}
              to={`${ROUTES.LEGAL}/${page.slug}`}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-3 transition hover:border-blue-100 hover:bg-blue-50/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/15 md:rounded-none md:border-0 md:bg-white md:px-3 md:py-2.5 md:hover:bg-gray-50 md:hover:shadow-none xl:py-3"
            >
              <span
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 md:h-7 md:w-7 md:rounded-md xl:h-8 xl:w-8 ${
                  meta.iconClassName ||
                  "bg-gray-50 text-gray-500 ring-gray-100"
                }`}
              >
                <Icon
                  className="h-4 w-4 md:h-3.5 md:w-3.5 xl:h-4 xl:w-4"
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-gray-800 sm:text-sm md:text-xs md:font-medium 2xl:text-sm">
                  {page.title}
                </span>
                <span className="mt-0.5 block truncate text-[11px] leading-4 text-gray-500 sm:text-xs md:text-[11px] 2xl:text-xs">
                  {meta.helper || `Version ${page.version}`}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-primary md:h-3.5 md:w-3.5" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export { ProfileLegalLinks };
