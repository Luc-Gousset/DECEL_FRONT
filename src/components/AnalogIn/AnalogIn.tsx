import {AnalogIN_t} from "@/components/interface";

import React, { useEffect, useState } from "react";

interface AnalogIN_props {
    analogIn_array: AnalogIN_t[],
}

const AnalogIN: React.FC<AnalogIN_props> = ({ analogIn_array }: AnalogIN_props) => {
    const Analogin_content = analogIn_array
    .filter(val => val.is_enable === true)
    .map(val => (
        <div key={val.id} className="flex  justify-between px-4 py-1 mb-1">
            <span className="text-lg font-medium text-gray-800">{val.name}:  </span>
            <span className="text-lg font-medium text-gray-800 ml-4"> {val.value}V</span>
        </div>
    ));
  
  return (
    <div className="flex flex-col items-center bg-gray-300 rounded-lg shadow-md w-1/4 h-1/4 m-4">
    
      <span className="text-2xl font-medium text-gray-800">Analog Input</span>
      <div className="flex flex-wrap overflow-auto">
        {Analogin_content}
      </div>
    </div>
  );
  
};
  
export default AnalogIN;