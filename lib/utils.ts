'use server';

export async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getBaseUrl() {
    return process.env.BACKEND_URL
}