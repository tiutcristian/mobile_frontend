import { Listing, LocalStorageAction } from "../types";
import { createListing } from "../apiCalls/createListing";
import { editListing } from "../apiCalls/editListing";
import { deleteListing } from "../apiCalls/deleteListing";

export async function getLocalListings() {
    const listings = localStorage.getItem("listings");
    if (listings) {
        return JSON.parse(listings);
    }
    return [];
}

export async function getLocalListing(id: number) {
    const listings = await getLocalListings();
    const listing = listings.find((listing: Listing) => listing.id === id);
    if (listing) {
        return listing;
    }
    return null;
}

export async function setLocalListings(listings: Listing[]) {
    localStorage.setItem("listings", JSON.stringify(listings));
}

export async function addLocalListing(listing: Listing) {
    const listings = await getLocalListings();
    listings.push(listing);
    setLocalListings(listings);
}

export async function updateLocalListing(id: number, updatedListing: Listing) {
    const listings = await getLocalListings();
    const index = listings.findIndex((listing: Listing) => listing.id === id);
    if (index !== -1) {
        listings[index] = { ...listings[index], ...updatedListing };
        setLocalListings(listings);
    }
}

export async function deleteLocalListing(id: number) {
    const listings = await getLocalListings();
    const updatedListings = listings.filter((listing: Listing) => listing.id !== id);
    setLocalListings(updatedListings);
}

export async function getActionsQueue() {
    const actions = localStorage.getItem("actionsQueue");
    if (actions) {
        return JSON.parse(actions);
    }
    return [];
}

export async function setActionsQueue(actions: any[]) {
    localStorage.setItem("actionsQueue", JSON.stringify(actions));
}

export async function addActionToQueue(action: LocalStorageAction, payload: any) {
    const actionsQueue = await getActionsQueue();
    actionsQueue.push({ action, payload });
    setActionsQueue(actionsQueue);
}

export async function syncQueueChanges() {
    const actionsQueue = await getActionsQueue();
    if (actionsQueue.length > 0) {
        actionsQueue.forEach(async (actionObj: any) => {
            switch (actionObj.action) {
                case LocalStorageAction.CREATE:
                    const listing: Listing = actionObj.payload;
                    await createListingAPICall(listing);
                    break;
                case LocalStorageAction.UPDATE:
                    const updatedListing: Listing = actionObj.payload;
                    const idToUpdate: number = updatedListing.id;
                    await updateListingAPICall(idToUpdate, updatedListing);
                    break;
                case LocalStorageAction.DELETE:
                    const idToDelete: number = actionObj.payload;
                    await deleteListingAPICall(idToDelete);
                    break;
                default:
                    break;
            }
        });
        setActionsQueue([]);
    }
}




async function createListingAPICall(listing: Listing) {
    await createListing(
        listing.imageUrl,
        listing.title,
        listing.price,
        listing.make,
        listing.model,
        listing.description,
        listing.year,
        listing.mileage,
        listing.engineSize,
        listing.horsepower,
        listing.transmission,
        listing.fuelType
    )
    .then(async (data) => {
        // update id in local storage
        const listings = await getLocalListings();
        const index = listings.findIndex((listing: Listing) => listing.title === data.title);
        if (index !== -1) {
            listings[index].id = data.id;
            setLocalListings(listings);
        }
    })
    .catch((error) => {
        console.error('Error creating listing:', error);
        alert('Failed to create listing. Please try again.');
    });
}



async function updateListingAPICall(listingId: number, updatedListing: Listing) {
    await editListing(
        listingId,
        updatedListing.imageUrl,
        updatedListing.title,
        updatedListing.price,
        updatedListing.make,
        updatedListing.model,
        updatedListing.description,
        updatedListing.year,
        updatedListing.mileage,
        updatedListing.engineSize,
        updatedListing.horsepower,
        updatedListing.transmission,
        updatedListing.fuelType
    );
}




async function deleteListingAPICall(id: number) {
    await deleteListing(id);
}