import { useListings } from "@/app/context/ListingsContext";
import { Listing } from "@/app/types";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

interface ListingCardProps { listing : Listing; }

export default function ListingCard(props : ListingCardProps) {
    const { state, dispatch } = useListings();

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this listing?")) {
            dispatch({ type: "DELETE", payload: id });
        }
    };
  
    return (
        <div
            className="flex flex-col sm:flex-row items-center rounded-xl dark:bg-gray-800 justify-between"
        >
            <img
                className="object-cover sm:w-1/4 h-64 rounded-t-xl sm:rounded-none sm:rounded-s-xl"
                src={props.listing.image}
                alt={props.listing.title}
            />
            <div className="flex justify-between w-full sm:w-3/4 h-full">
                <div className="flex flex-col p-6 justify-between w-full">
                    <h5 className="text-xl font-semibold text-gray-900 dark:text-white">{props.listing.title}</h5>
                    <p className="text-gray-700 dark:text-gray-400 font-medium">${props.listing.price}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{props.listing.year}</p>
                </div>
                <div className="flex flex-col justify-center p-6 gap-4">
                    <Link 
                        className="bg-blue-900 text-white p-4 rounded-full hover:bg-blue-800 cursor-pointer flex justify-center"
                        href={`/listing/${props.listing.id}/view`}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </Link>
                    <Link 
                        className="bg-blue-900 text-white p-4 rounded-full hover:bg-blue-800 cursor-pointer flex justify-center"
                        href={`/listing/${props.listing.id}/edit`}
                    >
                        <FontAwesomeIcon icon={faPen} />
                    </Link>
                    <button 
                        className="bg-blue-900 text-white p-4 rounded-full hover:bg-blue-800 cursor-pointer flex justify-center"
                        onClick={() => handleDelete(props.listing.id)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        </div>
    );
}