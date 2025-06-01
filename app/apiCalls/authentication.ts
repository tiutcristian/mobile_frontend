import { getToken } from "@/lib/localStorageUtils";
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
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(`Login failed: ${await response.text()}`);
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
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(await response.text());
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

export async function setup2fa(username: string): Promise<{ qrUrl: string, secret: string }> {
    console.log("Setting up 2FA for user:", username);
    return new Promise(async (resolve, reject) => {
        fetch(`${await getBaseUrl()}/api/v1/twofa/setup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`,
            },
            body: JSON.stringify({ username: username }),
        })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(await response.text());
            }
            const data = await response.json();
            resolve({ qrUrl: data.qrUrl, secret: data.secret });
        })
        .catch((error) => {
            reject(error);
        });
    });
}

export async function verify2fa(username: string, code: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        await fetch(`${await getBaseUrl()}/api/v1/twofa/verify`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, code }),
        })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(await response.text());
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

export async function get2faStatus(username: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        fetch(`${await getBaseUrl()}/api/v1/twofa/status?username=${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${await getToken()}`,
            },
        })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(await response.text());
            }
            const data = await response.json();
            resolve(data.status);
        })
        .catch((error) => {
            reject(error);
        });
    });
}