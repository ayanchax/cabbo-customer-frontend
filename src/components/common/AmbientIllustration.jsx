import React from "react";

function AmbientIllustration({
  src,
  alt = "Illustration",
  className = "",
  containerClassName = "",
}) {
  return (
    <div className={`flex justify-center ${containerClassName}`}>
      <img
        src={src}
        alt={alt}
        aria-hidden="true"
        className={`
          w-full
      max-w-xs
      sm:max-w-sm
      object-contain
      pointer-events-none
      select-none
          ${className}
        `}
      />
    </div>
  );
}

export { AmbientIllustration };
