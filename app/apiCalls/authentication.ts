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

export async function registerUser(firstName: string, lastName: string, phone: string, email: string, password: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        fetch(`${await getBaseUrl()}/api/v1/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: `
                {
                    "firstName": "${firstName}",
                    "lastName": "${lastName}",
                    "phone": "${phone}",
                    "email": "${email}",
                    "password": "${password}"
                }
            `,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Registration failed');
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