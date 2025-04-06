'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Listing, LocalStorageAction } from './types';
import ListingCard from '@/components/ListingCard';
import { addActionToQueue, deleteLocalListing, getLocalListings, setLocalListings } from './offlineSupport/CRUDLocalStorage';
import { isServerUp } from './apiCalls/serverStatus';


export default function Home() {

	const [listings, setListings] = useState<Listing[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			if (await isServerUp()) {
				const params = new URLSearchParams({
					'page': '0',
					'size': '10',
				});
				fetch(`http://localhost:8080/api/v1/listings?${params}`, {
					method: 'GET',
					headers: {
						'x-api-key': 'mobile',
					},
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error('Failed to fetch data');
						}
						return response.json();
					})
					.then((data) => {
						setListings(data.content)
						setLocalListings(data.content);
					})				
					.then(() => setLoading(false))
					.catch((error) => console.error('Error fetching data:', error));
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
				await fetch(`http://localhost:8080/api/v1/listings/${id}`, {
					method: 'DELETE',
					headers: {
						'x-api-key': 'mobile',
					},
				})
					.then(async (response) => {
						if (!response.ok) {
							throw new Error('Failed to delete listing');
						}
					})
					.catch((error) => alert('Error deleting listing: ' + error));
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
				'size': '10',
				'title': search,
			});
			await fetch(`http://localhost:8080/api/v1/listings/search?${params}`, {
				method: 'GET',
				headers: {
					'x-api-key': 'mobile',
				},
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error('Failed to fetch data');
					}
					return response.json();
				}
				)
				.then((data) => setListings(data.content))
				.catch((error) => console.error('Error fetching data:', error));
		} else {
			const localListings = getLocalListings();
			const filteredListings = localListings.filter((listing: Listing) =>
				listing.title.toLowerCase().includes(search.toLowerCase())
			);
			setListings(filteredListings);
		}

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
			<SearchBar handleSearch={handleSearch}/>

			<Link 
				className="fixed bottom-8 right-8 bg-blue-700 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center cursor-pointer"
				href="/createListing"
			>
				<FontAwesomeIcon icon={faPlus} className="text-2xl" />
			</Link>
			

			{listings.length === 0 && (
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					No listings found
				</h1>
			)}

			{listings.length > 0 && (
				<div className="flex flex-col gap-8 w-full max-w-6xl">
					{listings.map((listing) => (
						<ListingCard
							key={listing.id}
							listing={listing}
							handleDelete={handleDelete}
						/>
					))}
				</div>
			)}
		</main>
	);
}