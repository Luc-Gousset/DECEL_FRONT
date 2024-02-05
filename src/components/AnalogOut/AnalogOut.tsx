import { AnalogOUT_t, SocketInterface } from "@/components/interface";
import Slider, { SliderProps } from 'rc-slider';
import Range from 'rc-slider';
import { useParams, } from "react-router-dom";
import { socket } from "@/App";

import 'rc-slider/assets/index.css';

import React, { useEffect, useState } from "react";

interface AnalogOUT_props {
    analogOUT_array: AnalogOUT_t[],
    set_analog_out_array: (value: AnalogOUT_t[]) => void,
}

interface AnalogOutputControlProps {
    output: AnalogOUT_t;
    index: number;
    onInputChange: (value: string, index: number) => void;
    onSliderChange: (value: number | number[], index: number) => void;
}

const AnalogOutputControl: React.FC<AnalogOutputControlProps> = ({ output, index, onInputChange, onSliderChange }) => {

    const mode = output.mode || 3.3;

    const step = mode / (Math.pow(2, 12));
    const max_value = output.max_value > mode ? mode : output.max_value;

    return (
        <div key={output.id} className="flex flex-row  w-full my-4">
            <span className="text-lg font-medium text-gray-800 mx-2 justify-center">{output.name}:</span>
            <input type='number' min={output.min_value} max={output.max_value} className="rounded-md" value={output.value} step={step}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e.target.value, index)} />
            <span className="text-lg font-medium text-gray-800 mx-2 justify-center">V</span>
            <Slider onChange={(val: number | number[]) => onSliderChange(val, output.id)}
                className="my-auto mx-3" value={output.value} min={output.min_value} max={max_value} step={step} />
        </div>
    );
};


const AnalogOUT: React.FC<AnalogOUT_props> = ({ analogOUT_array, set_analog_out_array }) => {

    const param = useParams();
    const card_id = param.cardId || "";


    const handleInput = (val: string, id: number) => {
        //round to closest step
        const mode = analogOUT_array[id].mode || 3.3;

        const step = mode / (Math.pow(2, 12));

        const rounded_val = parseFloat((Math.round(Number(val) / step) * step).toFixed(3));

        const updatedArray = analogOUT_array.map((c, i) => {
            if (c.id === id) {
                c.value = rounded_val;
                return c;
            } else {
                return c;
            }
        });

        set_analog_out_array(updatedArray);

        handleAnalogOutChange(id);
    };

    const handleSlider = (val: number | number[], id: number) => {
        if (typeof val === 'number') {
            const updatedArray = analogOUT_array.map((c, i) => {
                if (c.id === id) {
                    c.value = val;
                    return c;
                } else {
                    return c;
                }
            });

            set_analog_out_array(updatedArray);
            handleAnalogOutChange(id);
        }
    };


    const handleAnalogOutChange = (id: number) => {

        const analogOut: AnalogOUT_t = analogOUT_array[id];
        const socket_msg: SocketInterface = { message_header: "analog_out_update", card_id: parseInt(card_id), data: JSON.stringify(analogOut) };
        socket.send(JSON.stringify(socket_msg));

    }

    return (
        <div className="flex flex-col bg-gray-300 rounded-lg shadow-md p-4 my-2 items-center">
            <span className="text-2xl font-medium text-gray-800">Analog Output</span>

            {analogOUT_array.filter(val => val.is_enable === true).
                map((output, index) => (
                    <AnalogOutputControl key={output.id}
                        output={output}
                        index={output.id}
                        onInputChange={handleInput}
                        onSliderChange={handleSlider} />
                ))}
        </div>
    );
};

export default AnalogOUT;

