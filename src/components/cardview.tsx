import { useParams, } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { GPIO_t, AnalogIN_t, AnalogOUT_t, GPIO_State, MCP41010_t, } from "@/components/interface";
import DECEL_logo from '../assets/DECEL_logo.png';
import { Outlet, Link, useLoaderData } from "react-router-dom";
import { socket } from "@/App"

import GPIOout from '@/components/GPIOout/GPIOout';
import GPIOin from '@/components/GPIOin/GPIOin';
import AnalogIN from '@/components/AnalogIn/AnalogIn';
import AnalogOUT from '@/components/AnalogOut/AnalogOut'
import VideoPlayer from '@/components/hlsplayer';

import { SocketInterface, Card_config } from "@/components/interface";
import MCP41010Component from "./MCP41010";



export default function Card_view() {

    const [GPIOArray, setGPIOArray] = useState<GPIO_t[]>([]);
    const [AnalogINArray, setAnalogINArray] = useState<AnalogIN_t[]>([]);
    const [AnalogOUTArray, setAnalogOUTArray] = useState<AnalogOUT_t[]>([]);
    const [MCP41010, setMCP41010] = useState<MCP41010_t>();

    const param = useParams();
    const card_id = param.cardId;

    const data_load: Card_config = useLoaderData() as Card_config;

    socket.onmessage = (event) => {

        var msg: SocketInterface = JSON.parse(event.data);

        //If header is heartbeat ignore message 
        if (msg.message_header !== "heartbeat") {
            console.log("message received", msg);
            if (msg.card_id.toString() === card_id) {
                switch (msg.message_header) {
                    case "card_config":
                        var card_config: Card_config = (msg.data);
                        setGPIOArray(card_config.Gpio_conf);
                        break;

                    case "gpio_config":
                        const gpio_config: Array<GPIO_t> = JSON.parse(msg.data);
                        console.log(gpio_config)
                        setGPIOArray(gpio_config);
                        break;


                    case "analog_out_updated":
                        const analog_out_config: AnalogOUT_t = JSON.parse(msg.data);
                        console.log(analog_out_config);
                        const updatedArray = AnalogOUTArray.map((c, i) => {
                            if (c.id === analog_out_config.id) {
                                return analog_out_config;
                            } else {
                                return c;
                            }
                        });

                        setAnalogOUTArray(updatedArray);

                        break;
                    case "GPIO_IN_CHANGE":
                        const gpioIn_config: GPIO_t = JSON.parse(msg.data);
                        const updatedGpioArray = GPIOArray.map((c, i) => {
                            if (c.id === gpioIn_config.id) {
                                return gpioIn_config;
                            } else {
                                return c;
                            }
                        });
                        setGPIOArray(updatedGpioArray);
                        break;

                    case "ANALOG_IN_CHANGE":
                        const analogIn_config: AnalogIN_t = JSON.parse(msg.data);
                        const updatedAnalogInArray = AnalogINArray.map((c, i) => {
                            if (c.id === analogIn_config.id) {
                                return analogIn_config;
                            } else {
                                return c;
                            }
                        });
                        setAnalogINArray(updatedAnalogInArray);

                        break;

                    case "mcp41010_updated":
                        console.log("enter mcp update")
                        const MCP41010_config: MCP41010_t = JSON.parse(msg.data);
                        setMCP41010(MCP41010_config);
                        break;
                }
            }
        }

    };


    useEffect(() => {
        setGPIOArray(data_load.Gpio_conf);
        setAnalogINArray(data_load.AnalogIn_conf);
        setAnalogOUTArray(data_load.AnalogOut_conf);
        setMCP41010(data_load.MCP41010_conf);
    }, []);



    return (
        <>
            <div className="bg-gray-200  h-screen p-4 flex-row">
                <div className="flex justify-between place-items-center">

                    <div className="flex align-middle place-items-center">
                        <img className="h-12 m-2" src={DECEL_logo} />

                        <h1 className="text-3xl m-2">Carte {card_id}</h1>
                    </div>

                    <Link to="/">
                        <button className="bg-gray-500 p-2 rounded-xl hover:scale-125  duration-300 delay-75 ease-in-out shadow m-4 text-white">
                            Retour
                        </button>
                    </Link>

                </div>


                <div className="flex flex-row">

                    <div className="basis-1/3 mx-2">
                        <GPIOout gpio_array={GPIOArray} set_gpîo_array={setGPIOArray} />
                        <GPIOin gpio_array={GPIOArray} />

                    </div>

                    <div className="basis-1/3 mx-2">
                        <AnalogOUT analogOUT_array={AnalogOUTArray} set_analog_out_array={setAnalogOUTArray} />
                        <AnalogIN analogIn_array={AnalogINArray} />
                        <MCP41010Component potentiometer={MCP41010} set_potentiometer={setMCP41010} />

                    </div>

                    <div className="basis-1/3 mx-2">
                        <VideoPlayer src={`${window.location.origin}/webcam/card${card_id}/index.m3u8`} />
                    </div>

                </div>

            </div>

        </>
    );

}