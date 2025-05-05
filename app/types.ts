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
    id: number;
    imageUrl: string;
    title: string;
    price: number;
    make: string;
    model: string;
    description: string;
    year: number;
    mileage: number;
    engineSize: number;
    horsepower: number;
    transmission: Transmission;
    fuelType: FuelType;
};

export enum NetworkState {
    NETWORK_DOWN = "NETWORK_DOWN",
    SERVER_DOWN = "SERVER_DOWN",
    UP = "UP",
}

export type NetworkStateType = {
    networkState: NetworkState,
};

export type NetworkActionType = { 
    type: "UPDATE",
    payload: { 
        networkState: NetworkState,
    } 
}

export enum LocalStorageAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
};

export type UserType = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}