import React from "react";
import { CAB_TYPES } from "@/utils";
import { HatchbackCabIcon, SedanCabIcon, SuvCabIcon } from "@/components";

function Cab({ cabType, className = "" }) {
  if (cabType === CAB_TYPES.SUV || cabType === CAB_TYPES.SUV_PLUS) {
    return (
      <div className={`suv-cab-icon ${className}`}>
        <SuvCabIcon
          className={`${cabType === CAB_TYPES.SUV_PLUS ? "w-24" : "w-22"}`}
        />
      </div>
    );
  } else if (cabType === CAB_TYPES.HATCHBACK) {
    return (
      <div className={`hatchback-cab-icon ${className}`}>
        <HatchbackCabIcon />
      </div>
    );
  } else if (cabType === CAB_TYPES.SEDAN || cabType === CAB_TYPES.SEDAN_PLUS) {
    return (
      <div className={`sedan-cab-icon ${className}`}>
        <SedanCabIcon
          className={`${cabType === CAB_TYPES.SEDAN_PLUS ? "w-22" : "w-20"}`}
        />
      </div>
    );
  }

  return <div>Cab</div>;
}

export { Cab };
