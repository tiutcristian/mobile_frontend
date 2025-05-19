'use server';
import { getAPIKey, getBaseUrl } from "@/lib/utils";
import { Listing } from "../types";

export async function fetchFilteredListings(params: URLSearchParams): Promise<{ data: Listing[]; totalPages: number; } | null> {
    const apiURL = `${await getBaseUrl()}/api/v1/listings/search?${params}`;
    try {
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
                'x-api-key': await getAPIKey(),
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }
        return {
            data: data.content as Listing[],
            totalPages: data.totalPages as number,
        };
    } catch (error) {
        console.error('Error fetching listings:', error);
        return null;
    }
}