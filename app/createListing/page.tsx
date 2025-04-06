'use client';
import { useState } from "react";
import { FuelType, Listing, LocalStorageAction, Transmission } from "../types";
import { isServerUp } from "../apiCalls/serverStatus";
import { addActionToQueue, addLocalListing, getLocalListings } from "../offlineSupport/CRUDLocalStorage";

export default function Form() {
	// form state
	const [image, setImage] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [price, setPrice] = useState<number>(0);
	const [make, setMake] = useState<string>("");
	const [model, setModel] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [year, setYear] = useState<number>(0);
	const [mileage, setMileage] = useState<number>(0);
	const [engineSize, setEngineSize] = useState<number>(0);
	const [horsepower, setHorsepower] = useState<number>(0);
	const [transmission, setTransmission] = useState<Transmission>(Transmission.MANUAL);
	const [fuelType, setFuelType] = useState<FuelType>(FuelType.PETROL);


	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		var imagePlaceholder = "https://www.shutterstock.com/image-vector/car-logo-icon-emblem-design-600nw-473088025.jpg";

		// update local storage
		const newListing: Listing = {
			id: Date.now(),
			imageUrl: imagePlaceholder,
			title: title,
			price: price,
			make: make,
			model: model,
			description: description,
			year: year,
			mileage: mileage,
			engineSize: engineSize,
			horsepower: horsepower,
			transmission: transmission,
			fuelType: fuelType,
		};
		addLocalListing(newListing);
		
		if (await isServerUp()) {
			fetch(`http://localhost:8080/api/v1/listings/create`, {
				method: 'POST',
				headers: {
					'x-api-key': 'mobile',
					'Content-Type': 'application/json',
				},
				body: `
					{
						"userId": 1,
						"imageUrl": "${imagePlaceholder}",
						"title": "${title}",
						"price": ${price},
						"make": "${make}",
						"model": "${model}",
						"description": "${description}",
						"year": ${year},
						"mileage": ${mileage},
						"engineSize": ${engineSize},
						"horsepower": ${horsepower},
						"transmission": "${transmission}",
						"fuelType": "${fuelType}"
					}
				`,
			})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to create listing');
				}
				return response.json();
			})
			.then((data) => {
				window.location.href = `/listing/${data.id}/view`;
			})
			.catch((error) => {
				console.error('Error creating listing:', error);
				alert('Failed to create listing. Please try again.');
			});
		} else {
			addActionToQueue(LocalStorageAction.CREATE, `
				{
					"userId": 1,
					"imageUrl": "${imagePlaceholder}",
					"title": "${title}",
					"price": ${price},
					"make": "${make}",
					"model": "${model}",
					"description": "${description}",
					"year": ${year},
					"mileage": ${mileage},
					"engineSize": ${engineSize},
					"horsepower": ${horsepower},
					"transmission": "${transmission}",
					"fuelType": "${fuelType}"
				}	
			`);
			window.location.href = `/listing/${newListing.id}/view`;
		}
	}


	return (
		<main className="w-full max-w-4xl mx-auto p-4 flex flex-col align-center">
			<h1 className="text-2xl font-bold text-center">Create Listing</h1>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="flex flex-col">
					<label htmlFor="title" className="block">Title</label>
					<input 
						type="text" 
						id="title" 
						onChange={e => setTitle(e.target.value)}
						className="p-2 border border-gray-300 rounded" />
				</div>
				<div className="flex flex-col">
					<label htmlFor="price" className="block">Price</label>
					<input 
						type="number" 
						id="price" 
						onChange={e => setPrice(Number(e.target.value))}
						className="p-2 border border-gray-300 rounded"/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="make" className="block">Make</label>
					<input 
						type="text" 
						id="make" 
						onChange={e => setMake(e.target.value)}
						className="p-2 border border-gray-300 rounded"/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="model" className="block">Model</label>
					<input 
						type="text" 
						id="model" 
						onChange={e => setModel(e.target.value)}
						className="p-2 border border-gray-300 rounded"/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="description" className="block">Description</label>
					<textarea 
						id="description"
						onChange={e => setDescription(e.target.value)}
						className="p-2 border border-gray-300 rounded"/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="year" className="block">Year</label>
					<input 
						type="number" 
						id="year" 
						onChange={e => setYear(Number(e.target.value))}
						className="p-2 border border-gray-300 rounded"/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="mileage" className="block">Mileage</label>
					<input 
						type="number" 
						id="mileage" 
						onChange={e => setMileage(Number(e.target.value))}
						className="p-2 border border-gray-300 rounded"/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="engineSize" className="block">Engine Size</label>
					<input 
						type="number" 
						id="engineSize" 
						onChange={e => setEngineSize(Number(e.target.value))}
						className="p-2 border border-gray-300 rounded"/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="horsepower" className="block">Horsepower</label>
					<input 
						type="number" 
						id="horsepower"
						onChange={e => setHorsepower(Number(e.target.value))}
						className="p-2 border border-gray-300 rounded"/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="fuelType" className="block">Fuel Type</label>
					<select 
						id="fuelType" 
						value={fuelType} 
						onChange={e => setFuelType(e.target.value as FuelType)}
					>
						<option value={FuelType.PETROL}>Petrol</option>
						<option value={FuelType.DIESEL}>Diesel</option>
						<option value={FuelType.ELECTRIC}>Electric</option>
						<option value={FuelType.HYBRID}>Hybrid</option>
					</select>
				</div>
				<div className="flex flex-col">
					<label htmlFor="transmission" className="block">Transmission</label>
					<select 
						id="transmission" 
						value={transmission} 
						onChange={e => setTransmission(e.target.value as Transmission)}
					>
						<option value={Transmission.MANUAL}>Manual</option>
						<option value={Transmission.AUTOMATIC}>Automatic</option>
					</select>
				</div>
				<div>
					<label htmlFor="image" className="block">Image</label>
					<input 
						type="file" 
						id="image" 
						onChange={e => {
							const files = e.target.files;
							if (files && files.length) {
								const reader = new FileReader();
								reader.onload = () => {
									setImage(reader.result as string);
								}
								reader.readAsDataURL(files[0]);
							}
						}}
						className="p-2 border border-gray-300 rounded w-full"/>
				</div>
				<div className="flex justify-center space-x-4">
					<button 
						type="button" 
						className="bg-gray-600 text-white p-2 rounded hover:bg-gray-500 transition-colors duration-200"
						onClick={() => window.history.back()}
					>Cancel</button>
					<button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition-colors duration-200">Submit</button>
				</div>
			</form>
		</main>
	);
}