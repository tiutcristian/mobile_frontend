'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Listing, LocalStorageAction } from './types';
import ListingCard from '@/components/ListingCard';
import { addActionToQueue, deleteLocalListing, getLocalListings, setLocalListings } from './offlineSupport/CRUDLocalStorage';
import { isServerUp } from './apiCalls/serverStatus';
import { Spinner } from '@/components/Spinner';
import { fetchFilteredListings } from './apiCalls/fetchListings';
import { deleteListing } from './apiCalls/deleteListing';
import { useInView } from 'react-intersection-observer';
import { delay } from '@/lib/utils';
import SearchBar from '@/components/SearchBar';
import SimpleListingCard from '@/components/SimpleListingCard';


export default function Home() {

	const [listings, setListings] = useState<Listing[]>([]);
	const [search, setSearch] = useState<string>('');
	const [loading, setLoading] = useState(true);
	const [pagesLoaded, setPagesLoaded] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
    const { ref, inView } = useInView();

	const fetchListings = async (page: number, size: number) => {
		const params = new URLSearchParams({
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
	}, []);

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
					Loading listings...
				</h1>
			</main>
		);
	}

	return (
		<main className="p-8 pb-20 sm:p-20 font-sans flex flex-col items-center gap-8">			
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
			

			{listings.length === 0 && !loading && (
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					No listings yet. Create one to get started!
				</h1>
			)}

			{listings.length > 0 && (
				<>
					<div className="flex flex-col gap-8 w-full max-w-6xl">
						{listings.map((listing) => (
							<SimpleListingCard
								key={listing.id}
								listing={listing}
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