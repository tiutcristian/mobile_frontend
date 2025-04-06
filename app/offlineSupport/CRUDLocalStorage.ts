import { Listing, LocalStorageAction } from "../types";

export function getLocalListings() {
    const listings = localStorage.getItem("listings");
    if (listings) {
        return JSON.parse(listings);
    }
    return [];
}

export function getLocalListing(id: number) {
    const listings = getLocalListings();
    const listing = listings.find((listing: Listing) => listing.id === id);
    if (listing) {
        return listing;
    }
    return null;
}

export function setLocalListings(listings: Listing[]) {
    localStorage.setItem("listings", JSON.stringify(listings));
}

export function addLocalListing(listing: Listing) {
    const listings = getLocalListings();
    listings.push(listing);
    setLocalListings(listings);
}

export function updateLocalListing(id: number, updatedListing: Listing) {
    const listings = getLocalListings();
    const index = listings.findIndex((listing: Listing) => listing.id === id);
    if (index !== -1) {
        listings[index] = { ...listings[index], ...updatedListing };
        setLocalListings(listings);
    }
}

export function deleteLocalListing(id: number) {
    const listings = getLocalListings();
    const updatedListings = listings.filter((listing: Listing) => listing.id !== id);
    setLocalListings(updatedListings);
}

export function getActionsQueue() {
    const actions = localStorage.getItem("actionsQueue");
    if (actions) {
        return JSON.parse(actions);
    }
    return [];
}

export function setActionsQueue(actions: any[]) {
    localStorage.setItem("actionsQueue", JSON.stringify(actions));
}

export function addActionToQueue(action: LocalStorageAction, payload: any) {
    const actionsQueue = getActionsQueue();
    actionsQueue.push({ action, payload });
    setActionsQueue(actionsQueue);
}

export function syncQueueChanges() {
    const actionsQueue = getActionsQueue();
    if (actionsQueue.length > 0) {
        actionsQueue.forEach((actionObj: any) => {
            switch (actionObj.action) {
                case LocalStorageAction.CREATE:
                    const listing: Listing = actionObj.payload;
                    createListingAPICall(listing);
                    break;
                case LocalStorageAction.UPDATE:
                    const updatedListing: Listing = actionObj.payload;
                    const idToUpdate: number = updatedListing.id;
                    updateListingAPICall(idToUpdate, updatedListing);
                    break;
                case LocalStorageAction.DELETE:
                    const idToDelete: number = actionObj.payload;
                    deleteListingAPICall(idToDelete);
                    break;
                default:
                    break;
            }
        });
        setActionsQueue([]);
    }
}




function createListingAPICall(listing: Listing) {
    fetch(`http://localhost:8080/api/v1/listings/create`, {
        method: 'POST',
        headers: {
            'x-api-key': 'mobile',
            'Content-Type': 'application/json',
        },
        body: `
            {
                "userId": 1,
                "imageUrl": "${listing.imageUrl}",
                "title": "${listing.title}",
                "price": ${listing.price},
                "make": "${listing.make}",
                "model": "${listing.model}",
                "description": "${listing.description}",
                "year": ${listing.year},
                "mileage": ${listing.mileage},
                "engineSize": ${listing.engineSize},
                "horsepower": ${listing.horsepower},
                "transmission": "${listing.transmission}",
                "fuelType": "${listing.fuelType}"
            }
        `,
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Failed to create listing');
        }
        return response.json();
    })
    .then((data) => {
        // update id in local storage
        const listings = getLocalListings();
        const index = listings.findIndex((listing: Listing) => listing.imageUrl === data.imageUrl);
        if (index !== -1) {
            listings[index].id = data.id;
            setLocalListings(listings);
        }
        // redirect to the listing view page
        window.location.href = `/listing/${data.id}/view`;
    })
    .catch((error) => {
        console.error('Error creating listing:', error);
        alert('Failed to create listing. Please try again.');
    });
}



async function updateListingAPICall(listingId: number, updatedListing: Listing) {
    await fetch(`http://localhost:8080/api/v1/listings/${listingId}`, {
        method: 'PUT',
        headers: {
            'x-api-key': 'mobile',
            'Content-Type': 'application/json',
        },
        body: `
            {
                "id": ${listingId},
                "userId": 1,
                "imageUrl": "${updatedListing.imageUrl}",
                "title": "${updatedListing.title}",
                "price": ${updatedListing.price},
                "make": "${updatedListing.make}",
                "model": "${updatedListing.model}",
                "description": "${updatedListing.description}",
                "year": ${updatedListing.year},
                "mileage": ${updatedListing.mileage},
                "engineSize": ${updatedListing.engineSize},
                "horsepower": ${updatedListing.horsepower},
                "transmission": "${updatedListing.transmission}",
                "fuelType": "${updatedListing.fuelType}"
            }
        `,
    });
}




function deleteListingAPICall(id: number) {
    fetch(`http://localhost:8080/api/v1/listings/${id}`, {
        method: 'DELETE',
        headers: {
            'x-api-key': 'mobile',
            'Content-Type': 'application/json',
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Failed to delete listing');
        }
    })
    .catch((error) => {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing. Please try again.');
    });
}