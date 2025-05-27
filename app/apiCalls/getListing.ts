import { getBaseUrl, getJWTSecret } from "@/lib/utils";
import { Listing } from "../types";

export async function getListing(listingId: number): Promise<Listing | null> {
    return new Promise(async (resolve, reject) => {
        fetch(`${await getBaseUrl()}/api/v1/listings/${listingId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${await getJWTSecret()}`
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Listing not found');
            }
            return response.json();
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            console.error('Error fetching listing:', error);
            resolve(null);
        });
    });
}