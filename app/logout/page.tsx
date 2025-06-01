"use client";
import { removeToken } from "@/lib/localStorageUtils";

export default function handleLogout() {
    removeToken();
    localStorage.removeItem('email');
    
    if (typeof window !== 'undefined') {
        window.location.href = '/';
    }
}