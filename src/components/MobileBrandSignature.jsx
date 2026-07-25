import { APP } from "@/utils";
import { Heart, ShieldCheck } from "lucide-react";
import { BrandModel } from "@/components/common/icons/cabs";

function MobileBrandSignature() {
  return (
    <section
      aria-label="Cabbo brand note"
      className="mx-auto max-w-2xl px-4 pt-3 text-center md:hidden"
    >
      <div className="mx-auto max-w-xs py-5">
        <p className="pt-8 text-2xl font-black tracking-[0.08em] text-gray-300">
          #RideWith
          <span className="relative inline-block">
            <BrandModel
              decorative
              className="absolute -right-1 -top-9 h-14 w-20 opacity-40"
            />
            {APP.name}
          </span>
        </p>
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-500">
            <ShieldCheck
              className="h-4 w-4 shrink-0 text-amber-500"
              aria-hidden="true"
            />
            <span>Reliable. Simple. Safe.</span>
          </p>
          <p className="inline-flex items-center justify-center gap-1.5 text-xs leading-5 text-gray-400">
            <span>Made with</span>
            <Heart
              className="h-3.5 w-3.5 shrink-0 fill-rose-400 text-rose-400"
              aria-label="love"
            />
            <span>in Bangalore</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export { MobileBrandSignature };
