import { getBaseUrl, getAPIKey } from '../../lib/utils';

export async function deleteListing(id: number) {
    await fetch(`${getBaseUrl()}/api/v1/listings/${id}`, {
        method: 'DELETE',
        headers: {
            'x-api-key': getAPIKey(),
        },
    })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error('Failed to delete listing');
            }
        })
        .catch((error) => alert('Error deleting listing: ' + error));
}