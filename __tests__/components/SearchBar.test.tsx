import "@testing-library/jest-dom";
import SearchBar from "@/components/SearchBar";
import { expect, test, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe } from "node:test";
import { ListingContext } from "@/app/context/ListingsContext";

describe("SearchBar", () => {
    test("should render SearchBar", () => {
        const mockState = { listings: [] };
        const mockDispatch = jest.fn();
        jest.mock("../../app/context/ListingsContext", () => ({
            useListings: jest.fn(() => ({ state: mockState, dispatch: mockDispatch })),
        }));
        render(
            <ListingContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
                <SearchBar />
            </ListingContext.Provider>
        );
        expect(screen.getByPlaceholderText("Search Listings...")).toBeInTheDocument();
    });
    test("should show search results", () => {
        const mockState = { listings: [] };
        const mockDispatch = jest.fn();
        jest.mock("../../app/context/ListingsContext", () => ({
            useListings: jest.fn(() => ({ state: mockState, dispatch: mockDispatch })),
        }));
        render(
            <ListingContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
                <SearchBar />
            </ListingContext.Provider>
        );
        const searchInput = screen.getByPlaceholderText("Search Listings...");
        fireEvent.change(searchInput, { target: { value: "Toyota" } });
        expect(searchInput).toHaveValue("Toyota");
    });
});