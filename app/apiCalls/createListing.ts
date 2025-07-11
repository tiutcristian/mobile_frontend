import { getBaseUrl } from "@/lib/utils";
import { FuelType, Listing, Transmission } from "../types";
import { getToken } from "@/lib/localStorageUtils";

export async function createListing(
    image: string,
    title: string,
    price: number,
    make: string,
    model: string,
    description: string,
    year: number,
    mileage: number,
    engineSize: number,
    horsepower: number,
    transmission: Transmission,
    fuelType: FuelType
): Promise<Listing> {
    return new Promise(async (resolve, reject) => {
        fetch(`${await getBaseUrl()}/api/v1/listings/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
            body:  `
                {
                    "userId": 1,
                    "imageUrl": "${image}",
                    "title": "${title}",
                    "price": ${price},
                    "make": "${make}",
                    "model": "${model}",
                    "description": "${description}",
                    "year": ${year},
                    "mileage": ${mileage},
                    "engineSize": ${engineSize},
                    "horsepower": ${horsepower},
                    "transmission": "${transmission}",
                    "fuelType": "${fuelType}"
                }
            `,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to create listing');
            }
            return response.json();
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        });
    });
}