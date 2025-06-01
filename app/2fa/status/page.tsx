"use client";
import { get2faStatus } from "@/app/apiCalls/authentication";
import { useEffect, useState } from "react";

export default function Status2FA() {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
        window.location.href = '/login';
        return null;
    }

    const [username, setUsername] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('Successfully disabled 2FA');

    const getEmailFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || null;
        } catch (error) {
            console.error("Error decoding JWT:", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchStatus = async () => {
            const user = getEmailFromToken();
            if (user) {
                setUsername(user);
                setStatus(await get2faStatus(user));
            } else {
                window.location.href = '/login';
            }
        };
        fetchStatus();
    }, []);

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <p className="mt-10 text-center text-xl font-bold tracking-tight text-gray-300">
                    Two-Factor Authentication (2FA) Status
                </p>
                {
                    !status ? (
                        <div className="flex flex-col justify-center mt-6">
                            <p className="mt-2 text-center text-lg text-gray-500">
                                Loading 2FA status...
                            </p>
                        </div>
                    ) :
                    status === 'enabled' ? (
                        <div className="flex flex-col justify-center mt-6">
                            <p className="mt-2 text-center text-lg text-green-500">
                                2FA is currently enabled for <span className="font-bold">{username}</span>.
                            </p>
                            <p className="mt-2 text-center text-sm text-gray-400">
                                You can turn it off anytime by clicking <a href="/2fa/status" className="text-blue-500 hover:underline">here</a>.
                            </p>
                        </div>
                        
                    ) : (
                        <div className="flex flex-col justify-center mt-6">
                            <p className="mt-2 text-center text-lg text-red-500">
                                2FA is currently disabled for <span className="font-bold">{username}</span>.
                            </p>
                            <p className="mt-2 text-center text-sm text-gray-400">
                                You can enable it anytime by clicking <a href="/2fa/setup" className="text-blue-500 hover:underline">here</a>.
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}