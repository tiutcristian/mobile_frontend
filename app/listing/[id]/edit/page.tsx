"use client";

import { useEffect, useState } from "react";
import { FuelType, Listing, LocalStorageAction, Transmission } from "../../../types";
import { useParams } from "next/navigation";
import { addActionToQueue, getLocalListing, updateLocalListing } from "@/app/offlineSupport/CRUDLocalStorage";
import { isServerUp } from "@/app/apiCalls/serverStatus";
import { getListing } from "@/app/apiCalls/getListing";
import { editListing } from "@/app/apiCalls/editListing";

export default function Form() {

	let params = useParams();
	const listingId = parseInt(params.id as string)

	const [listing, setListing] = useState<Listing | null>(null);

	const [image, setImage] = useState<string>(listing ? listing.imageUrl : "/images/placeholder.png");
	const [title, setTitle] = useState<string>(listing ? listing.title : "");
	const [price, setPrice] = useState<number>(listing ? listing.price : 0);
	const [make, setMake] = useState<string>(listing ? listing.make : "");
	const [model, setModel] = useState<string>(listing ? listing.model : "");
	const [description, setDescription] = useState<string>(listing ? listing.description : "");
	const [year, setYear] = useState<number>(listing ? listing.year : 0);
	const [mileage, setMileage] = useState<number>(listing ? listing.mileage : 0);
	const [engineSize, setEngineSize] = useState<number>(listing ? listing.engineSize : 0);
	const [horsepower, setHorsepower] = useState<number>(listing ? listing.horsepower : 0);
	const [transmission, setTransmission] = useState<Transmission>(listing ? listing.transmission : Transmission.MANUAL);
	const [fuelType, setFuelType] = useState<FuelType>(listing ? listing.fuelType : FuelType.PETROL);
	

	useEffect(() => {
		const fetchListing = async () => {
			var foundListing = null;
			if (await isServerUp()) {
				await getListing(listingId)
				.then((data) => foundListing = data)
				.catch((error) => console.error('Error fetching listing:', error));
			} else {
				foundListing = getLocalListing(listingId);
			}
			if (foundListing) {
				setListing(foundListing);
				setImage(foundListing.imageUrl);
				setTitle(foundListing.title);
				setPrice(foundListing.price);
				setMake(foundListing.make);
				setModel(foundListing.model);
				setDescription(foundListing.description);
				setYear(foundListing.year);
				setMileage(foundListing.mileage);
				setEngineSize(foundListing.engineSize);
				setHorsepower(foundListing.horsepower);
				setTransmission(foundListing.transmission);
				setFuelType(foundListing.fuelType);
			}
		};
		fetchListing();
	}
	, [listingId]);

	
	if (!listing) {
		return (
			<main className="p-8 pb-20 sm:p-20 font-sans flex flex-col items-center gap-8">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Listing not found</h1>
			</main>
		);
	}


	const formValidation = {
		title: {
			required: true,
			minLength: 5,
			maxLength: 100,
		},
		price: {
			required: true,
			min: 0,
			max: 1000000,
		},
		make: {
			required: true,
			minLength: 2,
			maxLength: 50,
		},
		model: {
			required: true,
			minLength: 2,
			maxLength: 50,
		},
		description: {
			minLength: 0,
			maxLength: 1000,
		},
		year: {
			required: true,
			min: 1800,
			max: new Date().getFullYear(),
		},
		mileage: {
			required: true,
			min: 0,
			max: 10000000,
		},
		engineSize: {
			required: true,
			min: 0,
			max: 10000,
		},
		horsepower: {
			required: true,
			min: 0,
			max: 10000,
		},
	};

	const validateListing = (listing: Listing) => {
		const errors: string[] = [];

		for (const key in formValidation) {
			const rules = formValidation[key as keyof typeof formValidation];
			const value = listing[key as keyof Listing];

			if ('required' in rules && rules.required && !value) {
				errors.push(`${key} is required`);
			}

			if ('minLength' in rules && typeof value === 'string' && value.length < rules.minLength) {
				errors.push(`${key} must be at least ${rules.minLength} characters long`);
			}

			if ('maxLength' in rules && typeof value === 'string' && value.length > rules.maxLength) {
				errors.push(`${key} must be at most ${rules.maxLength} characters long`);
			}

			if ('min' in rules && typeof value === 'number' && value < rules.min) {
				errors.push(`${key} must be at least ${rules.min}`);
			}

			if ('max' in rules && typeof value === 'number' && value > rules.max) {
				errors.push(`${key} must be at most ${rules.max}`);
			}
		}

		if (errors.length) {
			alert(errors.join('\n'));
			return false;
		}

		return true;
	}


	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		var imagePlaceholder = "/images/placeholder.png";

		if (image) {
			imagePlaceholder = image;
		}

		// update local storage
		const newListing: Listing = {
			id: listingId,
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
		updateLocalListing(listingId, newListing);

		if (await isServerUp()) {
			await editListing(
				listingId,
				imagePlaceholder,
				title,
				price,
				make,
				model,
				description,
				year,
				mileage,
				engineSize,
				horsepower,
				transmission,
				fuelType
			).then(() => window.location.href = `/listing/${newListing.id}/view`)
			.catch((error) => alert('Failed to edit listing. An error occurred: ' + error));
		} else {
			addActionToQueue(LocalStorageAction.UPDATE, newListing);
			window.location.href = `/listing/${newListing.id}/view`;
		}
	}

	return (
		<main className="w-full max-w-4xl mx-auto p-4 flex flex-col align-center">
			<h1 className="text-2xl font-bold text-center">Update Listing</h1>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="flex flex-col">
					<label htmlFor="title" className="block">Title</label>
					<input
						type="text"
						id="title"
						value={title}
						onChange={e => setTitle(e.target.value)}
						className="p-2 border border-gray-300 rounded" />
				</div>
				<div className="flex flex-col">
					<label htmlFor="price" className="block">Price</label>
					<input
						type="number"
						id="price"
						value={price}
						onChange={e => setPrice(Number(e.target.value))}
						className="p-2 border border-gray-300 rounded" />
				</div>
				<div className="flex flex-col">
					<label htmlFor="make" className="block">Make</label>
					<input
						type="text"
						id="make"
						value={make}
						onChange={e => setMake(e.target.value)}
						className="p-2 border border-gray-300 rounded" />
				</div>
				<div className="flex flex-col">
					<label htmlFor="model" className="block">Model</label>
					<input
						type="text"
						id="model"
						value={model}
						onChange={e => setModel(e.target.value)}
						className="p-2 border border-gray-300 rounded" />
				</div>
				<div className="flex flex-col">
					<label htmlFor="description" className="block">Description</label>
					<textarea
						id="description"
						value={description}
						onChange={e => setDescription(e.target.value)}
						className="p-2 border border-gray-300 rounded" />
				</div>
				<div className="flex flex-col">
					<label htmlFor="year" className="block">Year</label>
					<input
						type="number"
						id="year"
						value={year}
						onChange={e => setYear(Number(e.target.value))}
						className="p-2 border border-gray-300 rounded" />
				</div>
				<div className="flex flex-col">
					<label htmlFor="mileage" className="block">Mileage</label>
					<input
						type="number"
						id="mileage"
						value={mileage}
						onChange={e => setMileage(Number(e.target.value))}
						className="p-2 border border-gray-300 rounded" />
				</div>
				<div className="flex flex-col">
					<label htmlFor="engineSize" className="block">Engine Size</label>
					<input
						type="number"
						id="engineSize"
						value={engineSize}
						onChange={e => setEngineSize(Number(e.target.value))}
						className="p-2 border border-gray-300 rounded" />
				</div>
				<div className="flex flex-col">
					<label htmlFor="horsepower" className="block">Horsepower</label>
					<input
						type="number"
						id="horsepower"
						value={horsepower}
						onChange={e => setHorsepower(Number(e.target.value))}
						className="p-2 border border-gray-300 rounded" />
				</div>
				<div className="flex flex-col">
					<label htmlFor="fuelType" className="block">Fuel Type</label>
					<select
						id="fuelType"
						value={fuelType}
						onChange={e => setFuelType(e.target.value as FuelType)}
						className="p-2 border border-gray-300 rounded"
					>
						<option value={FuelType.PETROL}>PETROL</option>
						<option value={FuelType.DIESEL}>DIESEL</option>
						<option value={FuelType.ELECTRIC}>ELECTRIC</option>
						<option value={FuelType.HYBRID}>HYBRID</option>
					</select>
				</div>
				<div className="flex flex-col">
					<label htmlFor="transmission" className="block">Transmission</label>
					<select
						id="transmission"
						value={transmission}
						onChange={e => setTransmission(e.target.value as Transmission)}
						className="p-2 border border-gray-300 rounded"
					>
						<option value={Transmission.MANUAL}>MANUAL</option>
						<option value={Transmission.AUTOMATIC}>AUTOMATIC</option>
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
						className="p-2 border border-gray-300 rounded w-full" />
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