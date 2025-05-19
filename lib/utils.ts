'use server';

export async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getBaseUrl() {
    console.log(`getBaseUrl ${process.env.BACKEND_PRIVATE_DOMAIN}`);
    return process.env.BACKEND_PRIVATE_DOMAIN
}

export async function getAPIKey() {
    console.log(`getAPIKey ${process.env.API_KEY}`);
    return process.env.API_KEY || ""
}