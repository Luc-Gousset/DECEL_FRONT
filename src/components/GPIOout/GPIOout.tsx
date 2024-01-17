import { socket } from "@/App";
import { GPIO_State, GPIO_t, SocketInterface} from "@/components/interface";
import React, { useEffect, useState } from "react";
import Switch from "react-switch";
import { useParams, } from "react-router-dom";

interface GPIO_props {
  gpio_array: GPIO_t[],
  set_gpîo_array: (value: GPIO_t[])=>void,
}


const GPIOout: React.FC<GPIO_props> = ({gpio_array, set_gpîo_array}: GPIO_props) => {
  
  const param = useParams();
  const card_id = param.cardId || "";


  const handleGpioChange = (val: boolean, ev: MouseEvent | React.SyntheticEvent<MouseEvent | KeyboardEvent, Event>, id: string) => {
    let tempGPIOArray = gpio_array.slice();
    let tab_id = parseInt(id)
    val ? tempGPIOArray[tab_id].value = 1 : tempGPIOArray[tab_id].value = 0;
    set_gpîo_array(tempGPIOArray);
    const socket_msg: SocketInterface = {message_header: "gpio_update", card_id: parseInt(card_id), data: JSON.stringify(tempGPIOArray)};
    socket.send(JSON.stringify(socket_msg));


  };

  const GPIO_buttons = gpio_array.filter(val => val.state===GPIO_State.Output).length>0 ? gpio_array.filter(val => val.state===GPIO_State.Output).map((value, index) => 
    <div key={value.id} className="flex flex-wrap items-center justify-between px-4 py-2 ">
      <span className="text-lg font-medium text-gray-800 mx-3">{value.name}</span>
      <Switch
        id={value.id.toString()}
        onChange={handleGpioChange}
        checked={value.value === 1 ? true : false}
        onColor="#10B981"
        offColor="#E5E7EB"
        uncheckedIcon={false}
        checkedIcon={false}
      />
    </div>
  ):<span>Pas de GPIO </span>;

  return (
    <div className="flex flex-col items-center bg-gray-300 rounded-lg shadow-md p-4 my-2">
      <span className="text-2xl font-medium text-gray-800">GPIO Output</span>
      <div className="flex flex-wrap place-content-between">
        {GPIO_buttons}

      </div>
    </div>
  );
};

export default GPIOout;
