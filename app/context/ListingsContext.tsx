"use client";

import { createContext, useReducer, useContext, ReactNode } from "react";
import { ActionType, Listing, ListingsStateType } from "../types";
import jsonListings from "../listings.json";

const importedListings = jsonListings as Listing[];

export function listingReducer(state: ListingsStateType, action: ActionType): ListingsStateType {
  switch (action.type) {
    case "CREATE":
      return {
        ...state,
        listings: [...state.listings, action.payload],
      };
    case "UPDATE":
      return {
        ...state,
        listings: state.listings.map((listing) =>
          listing.id === action.payload.id ? action.payload : listing
        ),
      };
    case "DELETE":
      return {
        ...state,
        listings: state.listings.filter((listing) => listing.id !== action.payload),
      };
    case "FILTER":
      return {
        ...state,
        listings: importedListings.filter((l) => l.title.toLowerCase().includes(action.payload.toLowerCase())),
      };
    default:
      return state;
  }
}

export const ListingContext = createContext<
  | { state: ListingsStateType; dispatch: React.Dispatch<ActionType> }
  | undefined
>(undefined);

export function ListingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(listingReducer, { listings: importedListings as Listing[] });

  return (
    <ListingContext.Provider value={{ state, dispatch }}>
      {children}
    </ListingContext.Provider>
  );
}

// custom hook
export function useListings() {
  const context = useContext(ListingContext);
  if (!context) throw new Error("useListings must be used within a ListingProvider");
  return context;
}