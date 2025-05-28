import { Listing } from "@/app/types";
import CarAgeBadge from "./CarAgeBadge";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function SimpleListingCard({ listing } : { listing: Listing }) {
    return (
        <div
            className="relative flex flex-col sm:flex-row items-center rounded-xl dark:bg-gray-800 justify-between"
        >
            <CarAgeBadge listing={listing} />
            <img
                className="object-cover sm:w-1/4 h-64 rounded-t-xl sm:rounded-none sm:rounded-s-xl"
                src={listing.imageUrl}
                alt={listing.title}
            />
            <div className="flex justify-between w-full sm:w-3/4 h-64 p-2">
                <div className="flex flex-col p-6 justify-between w-full">
                    <h5 className="text-xl font-semibold text-gray-900 dark:text-white">{listing.title}</h5>
                    <p className="text-gray-700 dark:text-gray-400 font-medium">${listing.price}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{listing.year}</p>
                </div>
                <div className="flex flex-col justify-center p-6 gap-4">
                    <Link 
                        className="bg-blue-900 text-white p-4 rounded-full hover:bg-blue-800 cursor-pointer flex justify-center"
                        href={`/listing/${listing.id}/view`}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </Link>
                </div>
            </div>
        </div>
    );
}