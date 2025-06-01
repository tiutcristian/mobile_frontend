"use client";
import { removeToken } from "@/lib/localStorageUtils";

export default function handleLogout() {    
    if (typeof window !== 'undefined') {
        removeToken();
        localStorage.removeItem('email');
        window.location.href = '/';
    }
}