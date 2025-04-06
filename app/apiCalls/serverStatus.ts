export function isServerUp() {
    return fetch(`http://localhost:8080/api/v1/heartbeat`, {
        method: 'GET',
        headers: {
            'x-api-key': 'mobile',
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return true;
        })
        .catch(() => false);
}