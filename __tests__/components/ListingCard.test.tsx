import "@testing-library/jest-dom";
import ListingCard from "@/components/ListingCard";
import { expect, test, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe } from "node:test";
import importedListings from "../../app/listings.json";
import { Listing } from "@/app/types";
import { ListingContext } from "@/app/context/ListingsContext";

describe("ListingCard", () => {
    
    test("should render ListingCard", () => {
        const mockState = { listings: importedListings as Listing[] };
        const mockDispatch = jest.fn();
        jest.mock("../../app/context/ListingsContext", () => ({
            useListings: jest.fn(() => ({ 
                state: { mockState },
                dispatch: mockDispatch 
            })),
        }));
        const listing = mockState.listings[0];
        render(
            <ListingContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
                <ListingCard listing={listing} />
            </ListingContext.Provider>
        );
        expect(screen.getByText(listing.title)).toBeInTheDocument();
        expect(screen.getByText(`$${listing.price}`)).toBeInTheDocument();
        expect(screen.getByText(listing.year)).toBeInTheDocument();
    });
    test("should show delete confirmation popup", () => {
        jest.spyOn(window, "alert").mockImplementation(() => {});
        const mockState = { listings: importedListings as Listing[] };
        const mockDispatch = jest.fn();
        jest.mock("../../app/context/ListingsContext", () => ({
            useListings: jest.fn(() => ({ 
                state: { mockState },
                dispatch: mockDispatch 
            })),
        }));
        const listing = mockState.listings[0];
        render(
            <ListingContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
                <ListingCard listing={listing} />
            </ListingContext.Provider>
        );
        const deleteButton = screen.getByRole("button", { name: "" });
        fireEvent.click(deleteButton);
        expect(window.alert).not.toBeCalled();
    });
    test("should delete listing", () => {
        // mock confirm
        window.confirm = jest.fn(() => true);
        const mockState = { listings: importedListings as Listing[] };
        const mockDispatch = jest.fn();
        jest.mock("../../app/context/ListingsContext", () => ({
            useListings: jest.fn(() => ({ 
                state: { mockState },
                dispatch: mockDispatch 
            })),
        }));
        const listing = mockState.listings[0];
        render(
            <ListingContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
                <ListingCard listing={listing} />
            </ListingContext.Provider>
        );
        const deleteButton = screen.getByRole("button", { name: "" });
        fireEvent.click(deleteButton);
        expect(mockDispatch).toBeCalledWith({ type: "DELETE", payload: listing.id });
    });
});