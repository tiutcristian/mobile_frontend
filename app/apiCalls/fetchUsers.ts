import { getAPIKey, getBaseUrl } from "@/lib/utils";
import { UserType } from "../types";

export async function fetchUsersAsync() {
    const params = new URLSearchParams({
        'page': '0',
        'size': '5',
    });
    const apiURL = `${getBaseUrl()}/api/v1/users?${params}`;
    try {
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                'x-api-key': getAPIKey(),
            },
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