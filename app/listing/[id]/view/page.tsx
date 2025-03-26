"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useListings } from "@/app/context/ListingsContext";

export default function Page(props : { params : { id : string } }) {
    
    const { state, dispatch } = useListings();

    const listing = state.listings.find((l) => l.id === parseInt(props.params.id));
    if (!listing) {
        return (
            <main className="p-8 pb-20 sm:p-20 font-sans flex flex-col items-center gap-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Listing not found</h1>
            </main>
        );
    }

    return (
        <main className="p-8 pb-20 sm:p-20 font-sans flex flex-col items-center justify-center gap-8">
            {/* go back to dashboard */}
            <Link 
                className="fixed top-8 left-8 text-white hover:text-gray-300 flex items-center justify-center cursor-pointer gap-2"
                href="/"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
                Back to Dashboard
            </Link>
            <img className="w-1/3 object-cover rounded-xl" src={listing.image} alt={listing.title} />
            <div className="flex align-center justify-between gap-4 w-full max-w-6xl p-8 rounded-xl dark:bg-gray-800">
                <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">{listing.title}</h1>
                <p className="text-2xl text-gray-700 dark:text-gray-400 font-medium">${listing.price}</p>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-6xl p-8 rounded-xl dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-base">{listing.description}</p>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-6xl p-8 rounded-xl dark:bg-gray-800">
            <div className="px-4 sm:px-0">
                <h3 className="text-2xl font-semibold text-gray-200">Car details</h3>
            </div>
            <div className="mt-8 border-t border-gray-500">
                <dl className="divide-y divide-gray-500">
                <div className="py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                    <dt className="text-gray-200">Make</dt>
                    <dd className="text-sm/6 text-gray-400 sm:mt-0">{listing.make}</dd>
                </div>
                <div className="py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                    <dt className="text-gray-200">Model</dt>
                    <dd className="text-sm/6 text-gray-400 sm:mt-0">{listing.model}</dd>
                </div>
                <div className="py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                    <dt className="text-gray-200">Year</dt>
                    <dd className="text-sm/6 text-gray-400 sm:mt-0">{listing.year}</dd>
                </div>
                <div className="py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                    <dt className="text-gray-200">Mileage</dt>
                    <dd className="text-sm/6 text-gray-400 sm:mt-0">{listing.mileage} km</dd>
                </div>
                <div className="py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                    <dt className="text-gray-200">Engine Size</dt>
                    <dd className="text-sm/6 text-gray-400 sm:mt-0">{listing.engineSize}L</dd>
                </div>
                <div className="py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                    <dt className="text-gray-200">Horsepower</dt>
                    <dd className="text-sm/6 text-gray-400 sm:mt-0">{listing.horsepower} hp</dd>
                </div>
                <div className="py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                    <dt className="text-gray-200">Transmission</dt>
                    <dd className="text-sm/6 text-gray-400 sm:mt-0">{listing.transmission}</dd>
                </div>
                <div className="py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                    <dt className="text-gray-200">Fuel Type</dt>
                    <dd className="text-sm/6 text-gray-400 sm:mt-0">{listing.fuelType}</dd>
                </div>
                </dl>
            </div>
            </div>
        </main>
    );
}