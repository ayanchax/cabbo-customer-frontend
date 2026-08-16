import { LoaderCircle } from "lucide-react";

function RideOptionsSearchSkeleton({
  title = "Finding rides",
  message = "Checking available cabs and matching them to your trip.",
  className = "",
}) {
  return (
    <div
      className={`mx-auto flex min-h-[48vh] max-w-2xl flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-4 py-8 text-center shadow-sm ${className}`}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/10">
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        {title}
      </div>
      <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">{message}</p>
      <div className="mt-6 w-full max-w-xl space-y-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
          <div className="h-3 w-28 animate-pulse rounded-full bg-gray-200/70" />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded-full bg-gray-200/70" />
          <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-gray-200/70" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-24 animate-pulse rounded-xl border border-gray-100 bg-gray-50" />
          <div className="h-24 animate-pulse rounded-xl border border-gray-100 bg-gray-50" />
        </div>
      </div>
    </div>
  );
}

export { RideOptionsSearchSkeleton };
