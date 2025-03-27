
import "@testing-library/jest-dom";
import { expect, test } from "@jest/globals";
import { describe } from "node:test";
import importedListings from "../../app/listings.json";
import { Listing } from "@/app/types";
import { render, screen } from "@testing-library/react";
import CarAgeBadge from "@/components/CarAgeBadge";

describe("CarAgeBadge", () => {
    test("should render New badge", () => {
        const listing = importedListings[0];
        render(<CarAgeBadge listing={listing as Listing} />);
        const badge = screen.getByText("New");
        expect(badge).toBeInTheDocument();
    });

    test("should render Good badge", () => {
        const listing = importedListings[1];
        render(<CarAgeBadge listing={listing as Listing} />);
        const badge = screen.getByText("Good");
        expect(badge).toBeInTheDocument();
    });

    test("should render Old badge", () => {
        const listing = importedListings[3];
        render(<CarAgeBadge listing={listing as Listing} />);
        const badge = screen.getByText("Old");
        expect(badge).toBeInTheDocument();
    });
});