'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useListings } from './context/ListingsContext';
import ListingCard from '@/components/ListingCard';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';


export default function Home() {
	const { state, dispatch } = useListings();
	
	return (
		<main className="p-8 pb-20 sm:p-20 font-sans flex flex-col items-center gap-8">
			<SearchBar />

			<Link 
				className="fixed bottom-8 right-8 bg-blue-700 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center cursor-pointer"
				href="/createListing"
			>
				<FontAwesomeIcon icon={faPlus} className="text-2xl" />
			</Link>
			
			{state.listings.length === 0 && (
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					No listings found
				</h1>
			)}

			<div className="flex flex-col gap-8 w-full max-w-6xl">
				{state.listings.map((listing, index) => (
					<ListingCard
						key={index}
						listing={listing}
					/>
				))}
			</div>
		</main>
	);
}