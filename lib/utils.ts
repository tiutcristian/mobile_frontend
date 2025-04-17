export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getBaseUrl() {
    return "http://192.168.254.108:8080";
    // return "http://localhost:8080";
}