export enum Transmission {
    MANUAL = "MANUAL",
    AUTOMATIC = "AUTOMATIC",
}

export enum FuelType {
    PETROL = "PETROL",
    DIESEL = "DIESEL",
    ELECTRIC = "ELECTRIC",
    HYBRID = "HYBRID",
}

export type Listing = {
    id : number;
    imageUrl : string;
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