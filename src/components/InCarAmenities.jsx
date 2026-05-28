import React from "react";
import {
  Snowflake,
  Music,
  Droplet,
  PackageOpen,
  Plug,
  Headphones,
} from "lucide-react";

const AMENITIES = [
  {
    key: "ac",
    label: "AC",
    icon: <Snowflake className="text-blue-400" size={20} />,
  },
  {
    key: "music_system",
    label: "Music",
    icon: <Music className="text-indigo-400" size={20} />,
  },
  {
    key: "water_bottle",
    label: "Water",
    icon: <Droplet className="text-cyan-400" size={20} />,
  },
  {
    key: "tissues",
    label: "Tissues",
    icon: <PackageOpen className="text-pink-400" size={20} />,
  },
  {
    key: "phone_charger",
    label: "Charger",
    icon: <Plug className="text-green-400" size={20} />,
  },
  {
    key: "aux_cable",
    label: "AUX Cable",
    icon: <Headphones className="text-gray-400" size={20} />,
  },
];

function InCarAmenities(props) {
  // By default, show all amenities as available unless specified otherwise
  return (
    <div className={`${props.className}`}>
      {props.header && (
        <div className="text-xs sm:text-sm text-gray-500 font-medium mb-3">
          {props.header}
        </div>
      )}
      <div className={`flex flex-wrap gap-4`}>
        {AMENITIES.map(({ key, label, icon }) =>
          props[key] !== false ? (
            <div
              key={key}
              className="flex flex-col items-center text-xs text-gray-700 min-w-14"
            >
              <span className="text-lg mb-1">{icon}</span>
              <span>{label}</span>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

export { InCarAmenities };
