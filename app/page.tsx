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
import { fetchFilteredListings, fetchListings, getNoOfPages, getNoOfPagesFiltered } from './apiCalls/fetchListings';
import { deleteListing } from './apiCalls/deleteListing';
import { useInView } from 'react-intersection-observer';
import { delay } from '@/lib/utils';
import ButtonGroup from '@/components/ButtonGroup';
import SearchBar from '@/components/SearchBar';


export default function Home() {

	const [listings, setListings] = useState<Listing[]>([]);
	const [search, setSearch] = useState<string>('');
	const [loading, setLoading] = useState(true);
	const [pagesLoaded, setPagesLoaded] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
    const { ref, inView } = useInView();

	const fetchMoreListings = async () => {
        await delay(1000);
        const nextPage = pagesLoaded + 1;
        var newListings: Listing[] | null = null;
		if (search !== '') {
			const params = new URLSearchParams({
				'page': nextPage.toString(),
				'size': '5',
				'title': search,
			});
			newListings = await fetchFilteredListings(params);
		} else {
			newListings = await fetchListings(nextPage, 5);
		}
		console.log('Fetched page:', nextPage);
        setListings((prevListings) => [...prevListings, ...(newListings || [])]);
        setPagesLoaded(nextPage);
    };

    useEffect(() => {
        if (inView && pagesLoaded < totalPages - 1) {
            console.log("Loading more listings...");
            fetchMoreListings();
        }
    }, [inView]);

	useEffect(() => {
		const fetchNoOfPages = async () => {
			if (await isServerUp()) {
				const noOfPages = await getNoOfPages(5);
				if (noOfPages) {
					setTotalPages(noOfPages);
					console.log('Total pages:', noOfPages);
				}
			}
		};
		fetchNoOfPages();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			if (await isServerUp()) {
				const fetchedListings = await fetchListings(0, 5);
				setListings(fetchedListings || []);
				setLocalListings(fetchedListings || []);
				setLoading(false);
			} else {
				const localListings = getLocalListings();
				setListings(localListings);
				setLoading(false);
			}
		};

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

	const handleSearch = async (search: string) => {
		setLoading(true);

		if (await isServerUp()) {
			const params = new URLSearchParams({
				'page': '0',
				'size': '5',
				'title': search,
			});
			const fetchedListings = await fetchFilteredListings(params);
			if (fetchedListings) {
				setListings(fetchedListings);
				setLocalListings(fetchedListings);
			} else {
				console.error('Error fetching filtered listings');
			}
		} else {
			const localListings = getLocalListings();
			const filteredListings = localListings.filter((listing: Listing) =>
				listing.title.toLowerCase().includes(search.toLowerCase())
			);
			setListings(filteredListings);
		}

		setPagesLoaded(0);
		const noOfPages = await getNoOfPagesFiltered(new URLSearchParams({
			'page': '0',
			'size': '5',
			'title': search,
		}));
		setTotalPages(noOfPages || 0);

		setLoading(false);
	}
		
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
			<ButtonGroup
				children={["User1", "User2", "User3", "User4", "User5"]}
				onClick={(index) => {
					alert(`Button ${index + 1} clicked`);
				}}
			/>
			
			<SearchBar 
				search={search}
				setSearch={setSearch}
				handleSearch={handleSearch}
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