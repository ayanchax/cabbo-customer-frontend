import React from "react";
import indiaFlag from "flag-icons/flags/4x3/in.svg";

const CountryFlag = ({ countryCode }) => {

  
  if (countryCode?.toUpperCase() === "IN") {
    return (
      <img
        src={indiaFlag}
        alt=""
        className="h-4 w-5 rounded-sm object-cover shadow-[0_0_0_1px_rgba(15,23,42,0.08)]"
        aria-hidden="true"
      />
    );
  }

  return <span className="h-4 w-5 rounded-sm bg-gray-200" aria-hidden="true" />;
};

export {CountryFlag};