export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getBaseUrl() {
    console.log('process.env.BACKEND_PRIVATE_DOMAIN', process.env.BACKEND_PRIVATE_DOMAIN)
    return process.env.BACKEND_PRIVATE_DOMAIN
}

export function getAPIKey() {
    console.log('process.env.API_KEY', process.env.API_KEY)
    return process.env.API_KEY
}