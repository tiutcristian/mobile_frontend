'use server';

export async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getBaseUrl() {
    return `https://${process.env.BACKEND_PRIVATE_DOMAIN}`
}

export async function getAPIKey() {
    return process.env.API_KEY || ""
}