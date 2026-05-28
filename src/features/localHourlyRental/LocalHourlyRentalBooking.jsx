import React from 'react'

function LocalHourlyRentalBooking({ orderData, bookingData }) {
  console.log("Booking Data in LocalHourlyRentalBooking:", bookingData);
  console.log("Order Data in LocalHourlyRentalBooking:", orderData);
  return (
   <div
        className={` relative
        xl:w-3/4 min-h-screen overflow-y-auto
        bg-gray-50 sm:bg-white
        px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10
        py-2 xs:py-3 sm:py-6 md:py-8 lg:py-10
        mx-auto
        overflow-visible
        sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-screen-2xl
        sm:rounded-xl sm:shadow-lg
        shadow-[0_2px_16px_0_rgba(16,30,54,0.08)] max-w-full xl:mb-4
      `}>

        <div className="relative z-10">
          
        </div>
      </div>
  )
}

export  {LocalHourlyRentalBooking}