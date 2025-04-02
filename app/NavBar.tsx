"use client";
import { useEffect, useState } from "react";
import { useNetworkContext } from "./context/NetworkContext";
import { NetworkState } from "./types";

export default function NavBar() {
    const { state: nextworkState, dispatch: networkDispatch } = useNetworkContext();
    const [navClass, setNavClass] = useState("bg-gray-800 p-4");

    useEffect(() => {
        const interval = setInterval(() => {
            if (navigator.onLine) {
                console.log("Network up");
                fetch(`http://localhost:8080/api/v1/heartbeat`, {
                    method: 'GET',
                    headers: {
                        'x-api-key': 'mobile',
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch data');
                        }
                        networkDispatch({ type: "UPDATE", payload: { networkState: NetworkState.UP } });
                        setNavClass("bg-gray-800 p-4");
                        console.log('Server up');
                    })
                    .catch((() => { 
                        console.log('Server down'); 
                        setNavClass("bg-red-400 p-4");
                        networkDispatch({ type: "UPDATE", payload: { networkState: NetworkState.SERVER_DOWN } });
                    }));
            } else {
                console.log("Network down");
                setNavClass("bg-red-400 p-4");
                networkDispatch({ type: "UPDATE", payload: { networkState: NetworkState.NETWORK_DOWN } });
            }
            
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <nav className={navClass}>
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-semibold w-1/3 text-center">
                    Mobile RO Web App
                </div>
                <span className="text-red-700 w-1/3 text-center">
                    {nextworkState.networkState !== NetworkState.UP ?
                        nextworkState.networkState === NetworkState.SERVER_DOWN ?
                            "Server Down" :
                            "Network Down" :
                        ""}
                </span>
                <ul className="flex space-x-4 w-1/3 justify-end">
                    <li>
                        <a href="/" className="text-gray-300 hover:text-white">
                            Home
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}