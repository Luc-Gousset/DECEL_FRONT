import { useState } from "react";
import Switch from "react-switch";
import { GPIO_State, GPIO_t } from "@/components/interface";



interface GPIO_props {
  gpio_array: GPIO_t[],
}


const GPIOin: React.FC<GPIO_props> = ({ gpio_array }: GPIO_props) => {

  const GPIO_visu = gpio_array
  .filter(val => val.state === GPIO_State.Input)
  .map(val => (
    <div key={val.id} className="flex items-center justify-between w-1/2 px-4 py-1 mb-1">
      <span className="text-lg font-medium text-gray-800">{val.name}</span>
      <div className={`text-2xl w-9 ${val.value === 1 ? 'bg-green-400' : 'bg-red-400'} flex items-center justify-center`}>
        {val.value} 
      </div>
    </div>
  ));

return (
  <div className="flex flex-col items-center bg-gray-300 rounded-lg shadow-md p-4 my-2">
    <span className="text-2xl font-medium text-gray-800">GPIO Input</span>
    <div className="flex flex-wrap overflow-auto place-content-between">
      {GPIO_visu}
    </div>
  </div>
);
};


export default GPIOin;