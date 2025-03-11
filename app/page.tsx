export default function Home() {

	const listings = [
		{
			"image": "/images/corolla.png",
			"title": "Toyota Corolla 2020 for sale",
			"price": "20,000",
			"year": "2020",
		},
		{
			"image": "/images/yaris.png",
			"title": "Toyota Yaris 2019 for sale",
			"price": "15,000",
			"year": "2019",
		},
		{
			"image": "/images/camry.png",
			"title": "Toyota Camry 2018 for sale",
			"price": "25,000",
			"year": "2018",
		},
		{
			"image": "/images/rav4.png",
			"title": "Toyota RAV4 2017 for sale",
			"price": "30,000",
			"year": "2017",
		}
	]

	return (
		<main className="p-8 pb-20 sm:p-20 font-sans flex justify-center">
			<div className="flex flex-col gap-8 w-full max-w-6xl">
				{listings.map((listing, index) => (
					<a
						key={index}
						href="#"
						className="flex flex-col sm:flex-row items-center bg-white rounded-xl hover:scale-101 dark:bg-gray-800 justify-between"
					>
						<img
							className="object-cover sm:w-1/4 h-64 rounded-t-xl sm:rounded-none sm:rounded-s-xl"
							src={listing.image}
							alt={listing.title}
						/>
						<div className="flex justify-between w-full sm:w-3/4 h-full">
							<div className="flex flex-col p-6 justify-between w-full">
								<h5 className="text-xl font-semibold text-gray-900 dark:text-white">{listing.title}</h5>
								<p className="text-gray-700 dark:text-gray-400 font-medium">${listing.price}</p>
								<p className="text-gray-500 dark:text-gray-400 text-sm">{listing.year}</p>
							</div>
							<div className="flex flex-col justify-center p-6 gap-4">
								<button className="bg-blue-700 text-white font-bold p-4 rounded-2xl w-min hover:bg-blue-600 cursor-pointer margin-right-0">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-pen"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /></svg>
								</button>
								<button className="bg-blue-700 text-white font-bold p-4 rounded-2xl w-min hover:bg-blue-600 cursor-pointer">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
								</button>
							</div>
						</div>
					</a>
				))}
			</div>
		</main>
	);
}

