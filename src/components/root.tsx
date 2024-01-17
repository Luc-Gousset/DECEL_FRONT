import { Outlet, Link } from "react-router-dom";

import Settings_logo from '../assets/icon_setting.png';
import DECEL_logo from '../assets/DECEL_logo.png';



export default function Root() {
    return (
        <>
            <div className="bg-gray-200  h-screen flex-row p-4 select-none	">

                <img className="m-auto h-32" src={DECEL_logo} />


                <div className="flex flex-wrap place-content-center m-auto w-2/3 mt-10">
                    <Link to="/card/1">

                        <button className="relative rounded-lg bg-gray-400 place-content-center hover:scale-110  duration-300 delay-75 ease-in-out shadow m-4 ">
                            <h1 className="text-3xl p-2 m-4">
                                Carte 1
                            </h1>
                            <Link to="/card/1/edit">

                                <button className='right-1 top-2 absolute'><img className="h-5 hover:rotate-45 duration-300 delay-75 ease-in-out" src={Settings_logo} /></button>
                            </Link>
                        </button>

                    </Link>
                    <Link to="/card/2">

                        <button className="relative rounded-lg bg-gray-400 place-content-center hover:scale-110  duration-300 delay-75 ease-in-out shadow m-4 ">
                            <h1 className="text-3xl p-2 m-4">
                                Carte 2
                            </h1>
                            <Link to="/card/2/edit">

                                <button className='right-1 top-2 absolute'><img className="h-5 hover:rotate-45 duration-300 delay-75 ease-in-out" src={Settings_logo} /></button>
                            </Link>

                        </button>
                    </Link>

                    <Link to="/card/3">

                        <button className="relative rounded-lg bg-gray-400 place-content-center hover:scale-110  duration-300 delay-75 ease-in-out shadow m-4 ">
                            <h1 className="text-3xl p-2 m-4">
                                Carte 3
                            </h1>
                            <Link to="/card/3/edit">

                                <button className='right-1 top-2 absolute'><img className="h-5 hover:rotate-45 duration-300 delay-75 ease-in-out" src={Settings_logo} /></button>
                            </Link>

                        </button>
                    </Link>

                </div>
            </div>

        </>
    );
}