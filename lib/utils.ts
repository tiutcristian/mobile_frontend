import SETTINGS from "../settings.json";

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getBaseUrl() {
    const API_ADDRESS = SETTINGS.API_ADDRESS;
    const API_PORT = SETTINGS.API_PORT;

    // return `http://${API_ADDRESS}:${API_PORT}`;    
    return `http://localhost:8080`;
}

export function getAPIKey() {
    return SETTINGS.API_KEY;
}