import React from 'react'
import {useCustomer} from "@/hooks"
import { useCustomerUtility } from "@/features/customer/hooks";

function ProfileInformation() {
  const {customer} = useCustomer()
  const {getFirstName} = useCustomerUtility()
  const firstName = getFirstName(customer?.name);
  
  return (
    <div
      className={` relative
          xl:w-1/2 min-h-screen overflow-y-auto
          bg-gray-50 sm:bg-white
          px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10
          py-2 xs:py-3 sm:py-6 md:py-8 lg:py-10
          mx-auto
          overflow-visible
          sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-screen-2xl
          sm:rounded-xl sm:shadow-lg
          shadow-[0_2px_16px_0_rgba(16,30,54,0.08)] max-w-full xl:mb-4 pointer-events-auto
          "}
        `}
    >
      
      <div className="relative z-10">
        Hey {firstName}
      </div>
      </div>
  )
}

export  {ProfileInformation}