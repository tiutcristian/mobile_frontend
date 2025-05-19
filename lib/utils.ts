export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getBaseUrl() {
    return process.env.BACKEND_PRIVATE_DOMAIN
}

export function getAPIKey() {
    return process.env.API_KEY || ""
}