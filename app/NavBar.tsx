"use client";
import { useEffect, useState } from "react";
import { useNetworkContext } from "./context/NetworkContext";
import { NetworkState } from "./types";
import { isServerUp } from "./apiCalls/serverStatus";
import { syncQueueChanges } from "./offlineSupport/CRUDLocalStorage";
import { getToken } from "@/lib/localStorageUtils";

export default function NavBar() {
    const { state: nextworkState, dispatch: networkDispatch } = useNetworkContext();
    const [navClass, setNavClass] = useState("bg-gray-800 p-4");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () =>  {
            if (navigator.onLine) {
                if (await isServerUp()) {
                    networkDispatch({ type: "UPDATE", payload: { networkState: NetworkState.UP } });
                    setNavClass("bg-gray-800 p-4");
                    // sync queue changes
                    syncQueueChanges();
                } else {
                    setNavClass("bg-red-400 p-4");
                    networkDispatch({ type: "UPDATE", payload: { networkState: NetworkState.SERVER_DOWN } });
                }
            } else {
                setNavClass("bg-red-400 p-4");
                networkDispatch({ type: "UPDATE", payload: { networkState: NetworkState.NETWORK_DOWN } });
            }
        }, 3000); // check every 3 seconds
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        const token = getToken();
        setIsLoggedIn(!!token);
    }, []);

    return (
        <nav className={navClass}>
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-semibold w-1/3 justify-start">
                    Mobile Clone
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
                        {
                            isLoggedIn ?
                                <>
                                    <a href="/my-listings" className="text-gray-300 hover:text-white ml-4">
                                        My Listings
                                    </a>
                                    <a href="/2fa/status" className="text-gray-300 hover:text-white ml-4">
                                        2FA Status
                                    </a>
                                    <a href="/logout" className="text-gray-300 hover:text-white ml-4">
                                        Logout
                                    </a>
                                </>
                            :
                                <>
                                    <a href="/login" className="text-gray-300 hover:text-white ml-4">
                                        Login
                                    </a>
                                    <a href="/register" className="text-gray-300 hover:text-white ml-4">
                                        Register
                                    </a>
                                </> 
                        }
                    </li>
                </ul>
            </div>
        </nav>
    );
}