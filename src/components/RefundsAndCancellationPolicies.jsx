import React from 'react'
import { Info } from "lucide-react";

function RefundsAndCancellationPolicies({ policies = [], className = "", header=null }) {
  if(!policies || policies.length === 0) return null; // Don't render if no policies provided
    return (
    <div className={`${className}`}>
        {header && (
        <div className="flex items-center mb-2">
          
            
          <Info className="w-5 h-5 text-blue-400 mr-2" aria-hidden="true" />

            <span className="font-semibold text-gray-700 text-base sm:text-lg md:text-xl">
              {header}
            </span>
            
            
          
        </div>
        )}
        <ul className="list-disc pl-6 text-gray-600 text-sm sm:text-base space-y-1">
          {policies.map((text, idx) => (
            <li className="mb-1.5" key={idx}>{text}</li>
          ))}
        </ul>
    </div>
  );
}

export  {RefundsAndCancellationPolicies}