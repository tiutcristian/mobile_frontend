"use client";
import { useEffect, useState } from 'react';
import { verify2fa } from "@/app/apiCalls/authentication";
import { FormEvent } from "react";
import { setToken } from '@/lib/localStorageUtils';

export default function Verify2FA() {
    
    if (typeof window !== 'undefined' && !localStorage.getItem('email')) {
        window.location.href = '/login';
        return null;
    }

    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const username = localStorage.getItem('email') || '';
        if (username) {
            setUsername(username);
        } else {
            window.location.href = '/login';
        }
    }, []);
    
    async function handleClicked() {
        await verify2fa(username, code)
            .then((data) => {
                setToken(data.token);
                localStorage.removeItem('email'); // Clear the email after successful verification
                window.location.href = '/';
            })
            .catch((error) => {
                setMessage("error verifying 2FA: " + error.message);
            });
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-300">
                    Verify Two-Factor Authentication
                </h2>
            </div>
        
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="code" className="block text-sm/6 font-medium text-gray-300">
                            Verification Code
                        </label>
                        <div className="mt-2">
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                placeholder="Enter your verification code"
                                className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-gray-300 outline-1 -outline-offset-1 outline-gray-600 placeholder:text-gray-600 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                    </div>
            
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                            onClick={handleClicked}
                        >
                            Verify
                        </button>
                    </div>
                </div>
                
                {message && (
                    <div className="mt-4 text-center text-sm text-red-500">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}