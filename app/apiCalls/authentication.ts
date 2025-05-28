import { getBaseUrl } from "@/lib/utils";

export async function loginUser(email: string, password: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        fetch(`${await getBaseUrl()}/api/v1/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: `
                {
                    "email": "${email}",
                    "password": "${password}"
                }
            `,
        })
        .then((response) => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.text();
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        });
    });
}