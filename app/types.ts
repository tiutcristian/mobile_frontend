export enum Transmission {
    MANUAL = "Manual",
    AUTOMATIC = "Automatic",
}

export enum FuelType {
    PETROL = "Petrol",
    DIESEL = "Diesel",
    ELECTRIC = "Electric",
    HYBRID = "Hybrid",
}

export type Listing = {
    id : number;
    image : string;
	title : string;
    price : number;
    make : string;
    model : string;
	description : string;
    year : number;
    mileage : number;
    engineSize : number;
    horsepower : number;
    transmission : Transmission;
    fuelType : FuelType;
};

export type ListingsStateType = { listings: Listing[]; };

export type ActionType =
  | { type: "CREATE"; payload: Listing }
  | { type: "UPDATE"; payload: Listing }
  | { type: "DELETE"; payload: number }
  | { type: "FILTER"; payload: string };