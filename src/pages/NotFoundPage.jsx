import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { APP, ROUTES } from "@/utils";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-secondary">
      <header className="px-6 py-6 sm:px-10">
        <Link
          to={ROUTES.HOME}
          aria-label={`${APP.name} home`}
          className="inline-block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <img
            src={import.meta.env.VITE_APP_LOGO_URL}
            alt={APP.name}
            className="h-auto w-36 max-w-[70vw] sm:w-40"
          />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg text-center">
          <div aria-hidden="true" className="mb-8 flex items-center justify-center gap-3 text-primary">
            <span className="text-8xl font-black tracking-tighter sm:text-9xl">4</span>
            <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-primary/30 bg-blue-50 sm:h-24 sm:w-24">
              <MapPin className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
            </span>
            <span className="text-8xl font-black tracking-tighter sm:text-9xl">4</span>
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">404 · Page not found</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Looks like a wrong turn.</h1>
          <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-gray-600">
            We couldn&apos;t find this page. The link may be incorrect or the page may have moved. Let&apos;s get you back on your way.
          </p>

          <Link
            to={ROUTES.HOME}
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Back to home
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-sm text-gray-500">
        {APP.name} · {APP.tagline}
      </footer>
    </div>
  );
}
