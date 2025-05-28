"use client";
import { getToken } from "@/lib/localStorageUtils";
import { ReactNode, use, useEffect, useState } from "react";
import { Listing, LocalStorageAction, UserType } from "../types";
import { getUserByEmail } from "../apiCalls/fetchUsers";
import { useInView } from "react-intersection-observer";
import { fetchFilteredListings } from "../apiCalls/fetchListings";
import { isServerUp } from "../apiCalls/serverStatus";
import { addActionToQueue, deleteLocalListing, getLocalListings, setLocalListings } from "../offlineSupport/CRUDLocalStorage";
import { delay } from "@/lib/utils";
import { deleteListing } from "../apiCalls/deleteListing";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ListingCard from "@/components/ListingCard";
import { Spinner } from "@/components/Spinner";

export default function MyListingsPage() {
    const [currentUser, setCurrentUser] = useState<UserType | null>()
    const [listings, setListings] = useState<Listing[]>([]);
	const [search, setSearch] = useState<string>('');
	const [loading, setLoading] = useState(true);
	const [pagesLoaded, setPagesLoaded] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
    const { ref, inView } = useInView();

    function getCurrentUserFromJWT(): ReactNode {
        const token = getToken();
        if (!token) {
            return "not logged in";
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Decoded JWT payload:", payload);
            return payload.sub || "unknown user";
        } catch (error) {
            console.error("Error decoding JWT:", error);
            return "invalid token";
        }
    }

    async function getUser(email: string) {
        const user = await getUserByEmail(email);
        if (!user) {
            console.error("User not found for email:", email);
            return null;
        }
        
        setCurrentUser(user as UserType);
    }

    useEffect(() => {
        getUser(getCurrentUserFromJWT() as string);
    }, []);

    const fetchListings = async (page: number, size: number) => {
		const params = new URLSearchParams({
			'userId': currentUser?.id?.toString() || '1',
			'page': page.toString(),
			'size': size.toString()
		});
		if (search !== '') {
			params.set('title', search);
		}
		const fetchedData = await fetchFilteredListings(params);
		return fetchedData;
	};

    const fetchData = async () => {
		if (await isServerUp()) {
			const fetchedData = await fetchListings(0, 5);
			setListings(fetchedData?.data || []);
			setLocalListings(fetchedData?.data || []);
			setTotalPages(fetchedData?.totalPages || 0);
			setPagesLoaded(0);
			setLoading(false);
		} else {
			const localListings = await getLocalListings();
			setListings(localListings);
			setLoading(false);
		}
	};

	const fetchMoreListings = async (size: number) => {
        await delay(500);
        const nextPage = pagesLoaded + 1;
		var newListings = await fetchListings(nextPage, size);
		console.log('Fetched page:', nextPage);
        setListings((prevListings) => [...prevListings, ...(newListings?.data || [])]);
        setPagesLoaded(nextPage);
    };

    useEffect(() => {
        if (inView && pagesLoaded < totalPages - 1) {
            console.log("Loading more listings...");
            fetchMoreListings(5);
        }
    }, [inView]);

	useEffect(() => {
		fetchData();
	}, [currentUser]);

    const handleDelete = async (id: number) => {
		if (confirm('Are you sure you want to delete this listing?')) {
			
			deleteLocalListing(id);
			setListings((prevListings) => prevListings.filter((listing) => listing.id !== id));

			if (await isServerUp()) {
				await deleteListing(id);
			} else {
				addActionToQueue(LocalStorageAction.DELETE, id);
			}
		}
	};

    if (loading) {
		return (
			<main className="p-8 pb-20 sm:p-20 font-sans flex flex-col items-center gap-8">
				<div className="flex items-center justify-center w-full h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
				</div>
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Loading your listings...
				</h1>
			</main>
		);
	}

    return (

        <main className="p-8 pb-20 sm:p-20 font-sans flex flex-col items-center gap-8">
			<div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">My Listings</h1>
                <p className="text-gray-600">This page will display your listings.</p>
                <p className="text-gray-600">You are {currentUser?.firstName} {currentUser?.lastName}</p>
            </div>
			
			<SearchBar 
				search={search}
				setSearch={setSearch}
				handleSearch={fetchData}
			/>

			<Link 
				className="fixed bottom-8 right-8 bg-blue-700 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center cursor-pointer"
				href="/create-listing"
			>
				<FontAwesomeIcon icon={faPlus} className="text-2xl" />
			</Link>
			

			{listings.length === 0 && (
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					No listings found
				</h1>
			)}

			{listings.length > 0 && (
				<>
					<div className="flex flex-col gap-8 w-full max-w-6xl">
						{listings.map((listing) => (
							<ListingCard
								key={listing.id}
								listing={listing}
								handleDelete={handleDelete}
							/>
						))}
					</div>
					<div ref={ref} className="flex flex-column justify-center items-center">
						{totalPages-1 > pagesLoaded && <Spinner />}
					</div>
				</>
			)}
		</main>
    );
}