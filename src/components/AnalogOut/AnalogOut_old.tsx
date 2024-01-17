import { AnalogOUT_t } from "@/components/interface";
import Slider, {SliderProps} from 'rc-slider';
import Range from 'rc-slider';

import 'rc-slider/assets/index.css';

import React, { useEffect, useState } from "react";

interface AnalogOUT_props {
  analogOUT_array: AnalogOUT_t[],
  set_analog_out_array: (value: AnalogOUT_t[])=> void,
}

const AnalogOUT: React.FC<AnalogOUT_props> = ({ analogOUT_array, set_analog_out_array }: AnalogOUT_props) => {

  const handle_slider = (val:number | number[], id:number) => {
    console.log(id, val);
    let tempArray = analogOUT_array.slice();
    if(typeof val ==='number'){
      tempArray[id].value = val;
      set_analog_out_array(tempArray);
    }
  };

  const handle_input = (val:string, id:number) => {
    handle_slider(Number(val), id);
  };




  const Analogout_content = analogOUT_array.map((val, index) => (
    <div key={val.id} className="flex flex-row item-center w-full mx-3 my-4">
      
        <span className="text-lg font-medium text-gray-800 mx-2 item-center justify-center">{val.name}:</span>
        
        <input type='number' min={0} max={3.3} className="rounded-md" value={val.value} onChange={(e:React.ChangeEvent<HTMLInputElement>) => {handle_input(e.target.value, index)}}/>      
        <span className="text-lg font-medium text-gray-800 mx-2 item-center justify-center">V</span>


        <Slider  onChange={(val:number | number[]) => handle_slider(val, index)} className="w-1/3 my-auto mx-3" value={val.value} min={0} max={3.3} step={0.01}/>




    </div>
  ));



  return (
    <div className="flex flex-col bg-gray-300 rounded-lg shadow-md m-5 items-center">

      <span className="text-2xl font-medium text-gray-800">Analog Output</span>
      
      <div className="flex flex-wrap">
      {Analogout_content}

      </div>

    </div>
  );

};

export default AnalogOUT;