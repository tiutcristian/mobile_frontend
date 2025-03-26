import { Listing } from "@/app/types";

export default function CarAgeBadge({ listing }: { listing: Listing }) {
    const carAge = new Date().getFullYear() - listing.year;
    let ageGroup: string;
    let className: string;

    if (carAge <= 5) {
        ageGroup = "New";
        className = "absolute top-[-8] right-[-12] px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-lg";
    } else if (carAge <= 10) {
        ageGroup = "Good";
        className = "absolute top-[-8] right-[-12] px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-lg";
    } else {
        ageGroup = "Old";
        className = "absolute top-[-8] right-[-12] px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg";
    }

    return (
        <span className={className}>
            {ageGroup}
        </span>
    );
}