import React from "react";
import Slider from 'rc-slider';
import { SocketInterface , MCP41010_t } from "@/components/interface";
import { socket } from "@/App";

import { useParams, } from "react-router-dom";

interface MCP41010Props {
    potentiometer: MCP41010_t | undefined,
    set_potentiometer: (value: MCP41010_t) => void,
}

interface PotentiometerControlProps {
    potentiometer: MCP41010_t|undefined;
    index: number;
    onInputChange: (position: string) => void;
    onSliderChange: (position: number | number[]) => void;
}

const PotentiometerControl: React.FC<PotentiometerControlProps> = ({ potentiometer, index, onInputChange, onSliderChange }) => {
    const max_position = 255; // 8-bit resolution
    if (potentiometer != undefined)
    return (
        <div key={potentiometer.id} className="flex flex-row w-full my-4">
            <span className="text-md text-gray-800 mx-2 justify-center">Position:</span>
            <input type='number' min={0} max={max_position} className="rounded-md" value={potentiometer.position}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e.target.value)} />
            <Slider onChange={(val: number | number[]) => onSliderChange(val)}
                className="my-auto mx-3" value={potentiometer.position} min={0} max={max_position} step={1} />
        </div>
    );
    else
        return(<div>

        </div>);
};

const MCP41010Component: React.FC<MCP41010Props> = ({ potentiometer, set_potentiometer }) => {
    const param = useParams();
    const card_id = param.cardId || "";

    const handleInput = (val: string) => {
        const rounded_val = Math.min(Math.max(0, Math.round(parseFloat(val))), 255); // Ensuring value stays within 0-255 range
        if(potentiometer!= undefined)
        {
            console.log("input", val)
            const newPotentiometer = { ...potentiometer, position: rounded_val };
            set_potentiometer(newPotentiometer);
            handlePotentiometerChange(newPotentiometer);
    
    
        }
    };

    const handleSlider = (val: number | number[]) => {
        if (typeof val === 'number' && potentiometer!= undefined) {
            const newPotentiometer = { ...potentiometer, position: val };
            set_potentiometer(newPotentiometer);
            handlePotentiometerChange(newPotentiometer);
    
        }
    };

    const handlePotentiometerChange = (newPotentiometer: MCP41010_t) => {
        const socket_msg: SocketInterface = { message_header: "mcp41010_update", card_id: parseInt(card_id), data: JSON.stringify(newPotentiometer) };
        socket.send(JSON.stringify(socket_msg));
    }

    return (
        <div className="flex flex-col bg-gray-300 rounded-lg shadow-md p-4 my-2 items-center">
            <span className="text-2xl font-medium text-gray-800">Potentiomètre numérique</span>
                <PotentiometerControl key={potentiometer?.id}
                    potentiometer={potentiometer}
                    index={potentiometer?.id||0}
                    onInputChange={handleInput}
                    onSliderChange={handleSlider} />
        </div>
    );
};

export default MCP41010Component;
