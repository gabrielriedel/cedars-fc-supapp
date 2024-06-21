'use client';
import React from 'react';
import PartyDropdown from '@/components/DeleteComponent';  // Adjust path as needed
import Link from "next/link";
import Header from '@/components/Header';
import { Guest } from '@/components/Guest';

const RemovePage: React.FC = () => {
    const handleSelectedGuest = (guest: Guest | null) => {
        // This function can be used if you decide to handle guest selection later.
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-white">
            <div className="w-full p-8">
                <Link
                    href="/protected"
                    className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                </Link>
                {/* Center the title and restrict its width */}
                <div className="flex justify-center">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold py-2 px-8 my-4 bg-red-500 text-white rounded-full inline-block">
                        Remove Party Members
                    </h1>
                </div>
                <PartyDropdown setSelectedGuest={handleSelectedGuest} />
            </div>
        </div>
    );
};

export default RemovePage;
