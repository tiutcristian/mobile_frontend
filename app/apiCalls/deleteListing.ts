import { getBaseUrl, getJWTSecret } from '../../lib/utils';

export async function deleteListing(id: number) {
    await fetch(`${await getBaseUrl()}/api/v1/listings/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${await getJWTSecret()}`,
            'Content-Type': 'application/json',
        },
    })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error('Failed to delete listing');
            }
        })
        .catch((error) => alert('Error deleting listing: ' + error));
}