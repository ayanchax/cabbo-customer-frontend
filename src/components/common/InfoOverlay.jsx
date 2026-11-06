import { useEffect, useId, useRef } from "react";
import { LoaderCircle } from "lucide-react";

/**
 * A full-screen, indeterminate status view. Render in place of page content,
 * so covered links/buttons aren't left in the keyboard or screen-reader order.
 * Its owner controls completion; this component has no timers or navigation.
 */
function InfoOverlay({
  visible = false,
  message = "Please wait",
  subtext = "We're checking the latest status.",
}) {
  const titleId = useId();
  const descriptionId = useId();
  const screenRef = useRef(null);

  useEffect(() => {
    if (visible) screenRef.current?.focus({ preventScroll: true });
  }, [visible]);

  if (!visible) return null;

  return (
    <main
      ref={screenRef}
      tabIndex={-1}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="fixed inset-0 z-50 flex overflow-y-auto overscroll-contain bg-primary px-6 py-12 text-white outline-none sm:px-10"
    >
      <div className="m-auto w-full max-w-md text-center">
        <div aria-hidden="true" className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full bg-white/10 ring-1 ring-inset ring-white/20 sm:size-28">
          <LoaderCircle className="size-12 motion-safe:animate-spin sm:size-14" strokeWidth={1.5} />
        </div>
        <h1 id={titleId} className="text-2xl font-bold tracking-tight sm:text-3xl">{message}</h1>
        <p id={descriptionId} role="status" aria-live="polite" aria-atomic="true" className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white sm:text-base sm:leading-7">
          {subtext}
        </p>
      </div>
    </main>
  );
}

export { InfoOverlay };
