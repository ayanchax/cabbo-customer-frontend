import React from 'react'

function SelectedPackage({selectedPackage=null, className=""}) {
  return (
    <div className={` ${className}`}>
      <h3 className="text-gray-500 text-sm md:text-base lg:text-md mb-1">Selected Package</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary">
          {selectedPackage?.included_hours}h
        </span>
        <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-700">
          /{selectedPackage?.included_km}km
        </span>
      </div>
    </div>
  )
}

export  {SelectedPackage}