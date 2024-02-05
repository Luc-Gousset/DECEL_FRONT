import { useParams, } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { GPIO_t, AnalogIN_t, AnalogOUT_t, GPIO_State, MCP41010_t, AnalogOUT_Mode } from "@/components/interface";
import DECEL_logo from '../assets/DECEL_logo.png';
import { Outlet, Link, useLoaderData } from "react-router-dom";
import { socket } from "@/App"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SocketInterface, Card_config } from "@/components/interface";



export default function Card_edit_view() {
    const [GPIOArray, setGPIOArray] = useState<GPIO_t[]>([]);
    const [AnalogINArray, setAnalogINArray] = useState<AnalogIN_t[]>([]);
    const [AnalogOUTArray, setAnalogOUTArray] = useState<AnalogOUT_t[]>([]);
    const [MCP41010, setMCP41010] = useState<MCP41010_t>({ name: "", position: 0, is_enable: false, id: 0 });

    const params = useParams();
    const card_id = params.cardId;

    const data_loaded: Card_config = useLoaderData() as Card_config;

    useEffect(() => {
        if (data_loaded) {
            setGPIOArray(data_loaded.Gpio_conf);
            setAnalogINArray(data_loaded.AnalogIn_conf);
            setAnalogOUTArray(data_loaded.AnalogOut_conf);
            setMCP41010(data_loaded.MCP41010_conf);
        }
    }, [data_loaded]);

    const handleGpioNameChange = (index: number, newName: string) => {
        setGPIOArray(prevGpios => prevGpios.map((gpio, idx) =>
            idx === index ? { ...gpio, name: newName } : gpio
        ));
    };

    const handleGpioStateChange = (index: number, newState: GPIO_State) => {
        setGPIOArray(prevGpios => prevGpios.map((gpio, idx) =>
            idx === index ? { ...gpio, state: newState } : gpio
        ));
    };

    const handleSubmit = () => {
        if (card_id) {
            const config: Card_config = {
                Gpio_conf: GPIOArray,
                AnalogIn_conf: AnalogINArray,
                AnalogOut_conf: AnalogOUTArray,
                MCP41010_conf: MCP41010,
            };
            const socket_msg: SocketInterface = {
                message_header: "set_card_config",
                card_id: parseInt(card_id!),
                data: JSON.stringify(config)
            };
            socket.send(JSON.stringify(socket_msg));
            toast("Configuration sent", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    return (
        <>
            <div className="bg-gray-200 p-4 flex flex-col h-screen	m-0	">
                <div className="flex justify-between place-items-center">
                    <div className="flex align-middle place-items-center">
                        <img className="h-12 m-2" src={DECEL_logo} alt="DECEL Logo" />
                        <h1 className="text-3xl m-2">Carte {card_id}</h1>
                    </div>
                    <Link to="/">
                        <button className="bg-gray-500 p-2 rounded-xl hover:scale-125 duration-300 delay-75 ease-in-out shadow m-4 text-white">
                            Retour
                        </button>
                    </Link>


                </div>

                <div className="overflow-y-auto	m-0 ">
                    {/* GPIO Configuration */}
                    <div className="flex flex-wrap">
                        {GPIOArray.map((gpio, index) => (
                            <div key={index} className="m-2 p-2 border rounded bg-gray-300">
                                <h2 className="mb-2 font-bold">GPIO {gpio.id}</h2>
                                <div className="mb-2">
                                    <label htmlFor={`gpioName${index}`} className="mr-2">Nom:</label>
                                    <input
                                        type="text"
                                        id={`gpioName${index}`}
                                        value={gpio.name}
                                        onChange={(e) => handleGpioNameChange(index, e.target.value)}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor={`gpioState${index}`} className="mr-2">Etat:</label>
                                    <select
                                        id={`gpioState${index}`}
                                        value={gpio.state}
                                        onChange={(e) => handleGpioStateChange(index, Number(e.target.value) as GPIO_State)}
                                    >
                                        <option value={GPIO_State.Output}>Output</option>
                                        <option value={GPIO_State.Input}>Input</option>
                                        <option value={GPIO_State.Disabled}>Disabled</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AnalogIn Configuration */}
                    <div className="flex flex-wrap">
                        {AnalogINArray.map((analogIN, index) => (
                            <div key={index} className="m-2 p-2 border rounded bg-gray-300">
                                <h2 className="mb-2 font-bold">Analog IN {analogIN.id}</h2>
                                <div className="mb-2">
                                    <label className="mr-2">Enabled:</label>
                                    <input
                                        type="checkbox"
                                        checked={analogIN.is_enable}
                                        onChange={(e) => {
                                            const newAnalogINArray = [...AnalogINArray];
                                            newAnalogINArray[index] = { ...analogIN, is_enable: e.target.checked };
                                            setAnalogINArray(newAnalogINArray);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap">
                        {AnalogOUTArray.map((analogOUT, index) => (
                            <div key={index} className="m-2 p-2 border rounded bg-gray-300">
                                <h2 className="mb-2 font-bold">Analog OUT {analogOUT.id}</h2>
                                <div className="mb-2">
                                    <label className="mr-2">Name:</label>
                                    <input
                                        type="text"
                                        value={analogOUT.name}
                                        onChange={(e) => {
                                            const newAnalogOUTArray = [...AnalogOUTArray];
                                            newAnalogOUTArray[index] = { ...analogOUT, name: e.target.value };
                                            setAnalogOUTArray(newAnalogOUTArray);
                                        }}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="mr-2">Value:</label>
                                    <input
                                        type="number"
                                        value={analogOUT.value}
                                        onChange={(e) => {
                                            const newAnalogOUTArray = [...AnalogOUTArray];
                                            newAnalogOUTArray[index] = { ...analogOUT, value: parseFloat(e.target.value) };
                                            setAnalogOUTArray(newAnalogOUTArray);
                                        }}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="mr-2">Min Value:</label>
                                    <input
                                        type="number"
                                        value={analogOUT.min_value}
                                        onChange={(e) => {
                                            const newAnalogOUTArray = [...AnalogOUTArray];
                                            newAnalogOUTArray[index] = { ...analogOUT, min_value: parseFloat(e.target.value) };
                                            setAnalogOUTArray(newAnalogOUTArray);
                                        }}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="mr-2">Max Value:</label>
                                    <input
                                        type="number"
                                        value={analogOUT.max_value}
                                        onChange={(e) => {
                                            const newAnalogOUTArray = [...AnalogOUTArray];
                                            newAnalogOUTArray[index] = { ...analogOUT, max_value: parseFloat(e.target.value) };
                                            setAnalogOUTArray(newAnalogOUTArray);
                                        }}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="mr-2">Mode:</label>
                                    <select
                                        value={analogOUT.mode}
                                        onChange={(e) => {
                                            const newAnalogOUTArray = [...AnalogOUTArray];
                                            newAnalogOUTArray[index] = { ...analogOUT, mode: parseFloat(e.target.value) as AnalogOUT_Mode };
                                            setAnalogOUTArray(newAnalogOUTArray);
                                        }}
                                    >
                                        <option value={AnalogOUT_Mode.MODE_5V}>5V</option>
                                        <option value={AnalogOUT_Mode.MODE_3_3V}>3.3V</option>
                                        <option value={AnalogOUT_Mode.MODE_4_096V}>4.096V</option>
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <label className="mr-2">Enabled:</label>
                                    <input
                                        type="checkbox"
                                        checked={analogOUT.is_enable}
                                        onChange={(e) => {
                                            const newAnalogOUTArray = [...AnalogOUTArray];
                                            newAnalogOUTArray[index] = { ...analogOUT, is_enable: e.target.checked };
                                            setAnalogOUTArray(newAnalogOUTArray);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* MCP41010 Configuration */}
                    <div className="flex flex-wrap">
                        <div className="m-2 p-2 border rounded bg-gray-300">
                            <h2 className="mb-2 font-bold">MCP41010 Configuration</h2>
                            <div className="mb-2">
                                <label className="mr-2">Enabled:</label>
                                <input
                                    type="checkbox"
                                    checked={MCP41010.is_enable}
                                    onChange={(e) => setMCP41010({ ...MCP41010, is_enable: e.target.checked })}
                                />
                            </div>
                        </div>

                    </div>



                </div>

                <button
                    className="bg-blue-500 p-2 rounded-xl hover:bg-blue-600 duration-300 delay-75 ease-in-out shadow m-4 text-white font-bold w-40 m-auto"
                    onClick={handleSubmit}
                >
                    Save Configuration
                </button>
                <ToastContainer />
            </div>
        </>
    );
}