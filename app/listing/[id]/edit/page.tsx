"use client";

import { useState } from "react";
import { FuelType, Listing, Transmission } from "../../../types";
import { useParams } from "next/navigation";

export default function Form() {

	let params = useParams();
	const listingId = parseInt(params.id as string)

	// TODO: Fetch the listing from the API
	const [listing, setListing] = useState<Listing | null>(null);
	

	if (!listing) {
		return (
			<main className="p-8 pb-20 sm:p-20 font-sans flex flex-col items-center gap-8">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Listing not found</h1>
			</main>
		);
	}

	const [image, setImage] = useState<string>(listing.imageUrl);
	const [title, setTitle] = useState<string>(listing.title);
	const [price, setPrice] = useState<number>(listing.price);
	const [make, setMake] = useState<string>(listing.make);
	const [model, setModel] = useState<string>(listing.model);
	const [description, setDescription] = useState<string>(listing.description);
	const [year, setYear] = useState<number>(listing.year);
	const [mileage, setMileage] = useState<number>(listing.mileage);
	const [engineSize, setEngineSize] = useState<number>(listing.engineSize);
	const [horsepower, setHorsepower] = useState<number>(listing.horsepower);
	const [transmission, setTransmission] = useState<Transmission>(listing.transmission);
	const [fuelType, setFuelType] = useState<FuelType>(listing.fuelType);


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


	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		var imagePlaceholder = "/images/placeholder.png";

		const updatedListing: Listing = {
			id: listing.id,
			imageUrl: image || imagePlaceholder,
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

		if (validateListing(updatedListing)) {
			// TODO: PUT API call to update the listing
			window.history.back();
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