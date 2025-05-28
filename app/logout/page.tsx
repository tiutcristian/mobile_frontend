"use client";
import { removeToken } from "@/lib/localStorageUtils";

export default function handleLogout() {
    removeToken();
    
    if (typeof window !== 'undefined') {
        window.location.href = '/';
    }
}