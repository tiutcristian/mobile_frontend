import { getBaseUrl } from "@/lib/utils";
import { Listing } from "../types";

export async function fetchListings(page: number, size: number) {
    const params = new URLSearchParams({
        'page': page.toString(),
        'size': size.toString(),
    });
    const apiURL = `${getBaseUrl()}/api/v1/listings?${params}`;
    try {
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                'x-api-key': 'mobile',
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }
        return data.content as Listing[];
    } catch (error) {
        console.error('Error fetching listings:', error);
        return null;
    }
}

export async function getNoOfPages(size: number) {
    const params = new URLSearchParams({
        'page': '0',
        'size': size.toString(),
    });
    const apiURL = `${getBaseUrl()}/api/v1/listings?${params}`;
    try {
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                'x-api-key': 'mobile',
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }
        return data.totalPages as number;
    } catch (error) {
        console.error('Error fetching listings:', error);
        return null;
    }
}