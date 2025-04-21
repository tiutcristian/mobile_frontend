import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface SearchBarProps {
    search: string;
    setSearch: (search: string) => void;
    handleSearch: (search: string) => void;
}

export default function SearchBar({ search, setSearch, handleSearch }: SearchBarProps) {

    return (
        <div className="relative w-full max-w-6xl">
            <input 
                type="search"
                className="block p-2.5 w-full z-20 text-sm rounded-lg focus:ring-blue-500 bg-gray-700 placeholder-gray-400 text-white" 
                placeholder="Search Listings..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button 
                type="submit" 
                className="absolute top-0 end-0 p-2.5 h-full text-white bg-blue-700 rounded-e-lg hover:bg-blue-600 cursor-pointer"
                onClick={() => { handleSearch(search); setSearch(""); } }
            >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </div>
    );
}