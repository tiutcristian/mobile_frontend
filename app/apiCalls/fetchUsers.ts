import { getBaseUrl } from "@/lib/utils";
import { UserType } from "../types";
import { getToken } from "@/lib/localStorageUtils";

export async function fetchUsersAsync() {
    const params = new URLSearchParams({
        'page': '0',
        'size': '5',
    });
    const apiURL = `${await getBaseUrl()}/api/v1/users?${params}`;
    try {
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }
        return data.content as UserType[];
    } catch (error) {
        console.error('Error fetching listings:', error);
        return null;
    }
}

export async function getUserByEmail(email: string): Promise<UserType | null> {
    const apiURL = `${await getBaseUrl()}/api/v1/users/search?email=${email}`;
    try {
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user by email');
        }
        const data = await response.json();
        return data as UserType;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
}