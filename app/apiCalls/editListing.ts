import { getAPIKey, getBaseUrl } from "@/lib/utils";
import { FuelType, Transmission } from "../types";

export function editListing(
    id: number,
    imageUrl: string,
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
) {
    return new Promise(async (resolve, reject) => {
        fetch(`${getBaseUrl()}/api/v1/listings/${id}`, {
            method: 'PUT',
            headers: {
                'x-api-key': getAPIKey(),
                'Content-Type': 'application/json',
            },
            body:  `
                {
                    "id": ${id},
                    "userId": 1,
                    "imageUrl": "${imageUrl}",
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
                reject(new Error('Failed to edit listing'));
            }
            resolve(response);
        });
    });
}