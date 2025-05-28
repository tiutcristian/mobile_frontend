import { getBaseUrl } from "@/lib/utils";

export async function isServerUp() {
    return fetch(`${await getBaseUrl()}/api/v1/heartbeat`, {
        method: 'GET',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return true;
        })
        .catch(() => false);
}