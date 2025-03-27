import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "@jest/globals";
import { listingReducer, ListingProvider, useListings, ListingContext } from "@/app/context/ListingsContext";
import { ActionType, FuelType, Listing, Transmission } from "@/app/types";
import jsonListings from "../../app/listings.json";
import { JSX, ReactNode, useContext } from "react";

describe("ListingsContext", () => {
    test ("listingReducer CREATE", () => {
        const state = { listings: [] };
        const listing = {
            id: 1,
            image: "",
            title: "title",
            price: 1000,
            make: "make",
            model: "model",
            description: "description",
            year: 2021,
            mileage: 1000,
            engineSize: 1.6,
            horsepower: 100,
            transmission: Transmission.MANUAL,
            fuelType: FuelType.PETROL,
        };
        const action = { type: "CREATE", payload: listing };
        const updatedState = listingReducer(state, action as ActionType);
        expect(updatedState.listings).toHaveLength(1);
    });
    test ("listingReducer UPDATE", () => {
        const importedListings = jsonListings as Listing[];
        const state = { listings: importedListings };
        const listing = {
            id: 1,
            image: "",
            title: "newtitle",
            price: 1001,
            make: "newmake",
            model: "newmodel",
            description: "newdescription",
            year: 2022,
            mileage: 1001,
            engineSize: 1.7,
            horsepower: 101,
            transmission: Transmission.AUTOMATIC,
            fuelType: FuelType.DIESEL,
        };
        const action = { type: "UPDATE", payload: listing };
        const updatedState = listingReducer(state, action as ActionType);
        expect(updatedState.listings[0]).toEqual(listing);
    });
    test ("listingReducer DELETE", () => {
        const importedListings = jsonListings as Listing[];
        const state = { listings: importedListings };
        const action = { type: "DELETE", payload: 1 };
        const updatedState = listingReducer(state, action as ActionType);
        expect(updatedState.listings).toHaveLength(3);
        expect(updatedState.listings[0].id).not.toBe(1);
    });
    test ("listingReducer FILTER", () => {
        const importedListings = jsonListings as Listing[];
        const state = { listings: importedListings };
        const action = { type: "FILTER", payload: "ya" };
        const updatedState = listingReducer(state, action as ActionType);
        expect(updatedState.listings).toHaveLength(1);
        expect(updatedState.listings[0].title.toLowerCase()).toContain("ya");
    });
    test ("listingReducer default", () => {
        const state = { listings: [] };
        const action = { type: "UNKNOWN", payload: {} };
        const updatedState = listingReducer(state, action as ActionType);
        expect(updatedState).toEqual(state);
    });

    const TestComponent = () => {
        const context = useContext(ListingContext);
        if (!context) {
            return <div>Context is undefined</div>;
        }
        return <div>Listings Count: {context.state.listings.length}</div>;
    };
    test ("ListingProvider", () => {
        render (
            <ListingProvider>
              <TestComponent />
            </ListingProvider>
        );
        expect(screen.getByText(/Listings Count:/)).toBeInTheDocument();
    });

    const TestComponent2 = ({ children }: { children?: ReactNode }) => {
        useListings();
        return <div>Hook works!</div>;
    };
    test("throws an error when used outside ListingProvider", () => {
        expect(() => render(<TestComponent2 />)).toThrow(
            "useListings must be used within a ListingProvider"
        );
    });
    test ("useListings", () => {
        expect(() =>
            render(
              <ListingProvider>
                <TestComponent2 />
              </ListingProvider>
            )
          ).not.toThrow();
    });
});

