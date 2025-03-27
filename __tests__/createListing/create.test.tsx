import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Form from "../../app/createListing/page";
import { ListingContext } from "../../app/context/ListingsContext";
import { jest, describe, test, expect, afterEach } from "@jest/globals";
import { FuelType, Transmission } from "@/app/types";


describe("Form Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test ("Form renders correctly", () => {
        const mockState = { listings: [] };
        const mockDispatch = jest.fn();
        jest.mock("../../app/context/ListingsContext", () => ({
            useListings: jest.fn(() => ({ state: mockState, dispatch: mockDispatch })),
        }));

        render(
            <ListingContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
                <Form />
            </ListingContext.Provider>
        );
        expect(screen.getByText(/Create Listing/i)).toBeInTheDocument();
    });
    test ("Form validation with no input", () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const mockState = { listings: [] };
        const mockDispatch = jest.fn();
        jest.mock("../../app/context/ListingsContext", () => ({
            useListings: jest.fn(() => ({ state: mockState, dispatch: mockDispatch })),
        }));

        render(
            <ListingContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
                <Form />
            </ListingContext.Provider>
        );

        const submitButton = screen.getByRole("button", { name: "Submit" });
        fireEvent.click(submitButton);
        expect(window.alert).toBeCalledWith(expect.stringContaining("title is required"));
    });
    test ("Form validation with max value and max length", () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const mockState = { listings: [] };
        const mockDispatch = jest.fn();
        jest.mock("../../app/context/ListingsContext", () => ({
            useListings: jest.fn(() => ({ state: mockState, dispatch: mockDispatch })),
        }));

        render(
            <ListingContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
                <Form />
            </ListingContext.Provider>
        );

        const titleInput = screen.getByLabelText("Title");
        fireEvent.change(titleInput, { target: { value: "a".repeat(101) } });
        const yearInput = screen.getByLabelText("Year");
        fireEvent.change(yearInput, { target: { value: 2050 } });

        const submitButton = screen.getByRole("button", { name: "Submit" });
        fireEvent.click(submitButton);
        expect(window.alert).toBeCalledWith(expect.stringContaining("title must be at most 100 characters long"));
        expect(window.alert).toBeCalledWith(expect.stringContaining("year must be at most 2025"));
    });
    test ("Form validation with valid input", () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const mockState = { listings: [] };
        const mockDispatch = jest.fn();
        jest.mock("../../app/context/ListingsContext", () => ({
            useListings: jest.fn(() => ({ state: mockState, dispatch: mockDispatch })),
        }));

        render(
            <ListingContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
                <Form />
            </ListingContext.Provider>
        );

        fireEvent.change(screen.getByLabelText("Title"), { target: { value: "a".repeat(100) } });
        fireEvent.change(screen.getByLabelText("Price"), { target: { value: 1000 } });
        fireEvent.change(screen.getByLabelText("Make"), { target: { value: "Toyota" } });
        fireEvent.change(screen.getByLabelText("Model"), { target: { value: "Corolla" } });
        fireEvent.change(screen.getByLabelText("Description"), { target: { value: "a".repeat(1000) } });
        fireEvent.change(screen.getByLabelText("Year"), { target: { value: 2025 } });
        fireEvent.change(screen.getByLabelText("Mileage"), { target: { value: 1000 } });
        fireEvent.change(screen.getByLabelText("Engine Size"), { target: { value: 2000 } });
        fireEvent.change(screen.getByLabelText("Horsepower"), { target: { value: 100 } });

        const submitButton = screen.getByRole("button", { name: "Submit" });
        fireEvent.click(submitButton);
        expect(window.alert).not.toBeCalled();
    });
    test ("Changing select values", () => {
        const mockState = { listings: [] };
        const mockDispatch = jest.fn();
        jest.mock("../../app/context/ListingsContext", () => ({
            useListings: jest.fn(() => ({ state: mockState, dispatch: mockDispatch })),
        }));

        render(
            <ListingContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
                <Form />
            </ListingContext.Provider>
        );

        fireEvent.change(screen.getByLabelText("Fuel Type"), { target: { value: FuelType.DIESEL } });
        fireEvent.change(screen.getByLabelText("Transmission"), { target: { value: Transmission.AUTOMATIC } });

        expect(screen.getByLabelText("Fuel Type")).toHaveValue(FuelType.DIESEL);
        expect(screen.getByLabelText("Transmission")).toHaveValue(Transmission.AUTOMATIC);
    });
});