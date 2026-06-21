import React from 'react'

function SelectedPackage({selectedPackage=null, showDescription=true, className="", header="Selected Package"}) {
  return (
    <div className={` ${className}`}>
      
      {header && (
        <h3 className="text-gray-500 text-sm md:text-base lg:text-md mb-1 font-normal">{header}</h3>
      )}
      <div className="flex items-baseline gap-2">
        <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary">
          {selectedPackage?.included_hours}h
        </span>
        <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-700">
          /{selectedPackage?.included_km}km
        </span>
      </div>
      {/* Best intended for */}
      {showDescription && selectedPackage?.best_intended_for &&(
      <p className="text-xs sm:text-sm md:text-md text-gray-500 mt-1">
          {selectedPackage?.best_intended_for}
      </p>
      )}
    </div>
  )
}

export  {SelectedPackage}