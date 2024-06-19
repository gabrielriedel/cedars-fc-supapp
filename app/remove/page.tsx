'use client'

import React, { useEffect, useState } from 'react';
import { Guest } from '@/components/Guest';
import Link from "next/link";

interface PartyDropdownProps {
    setSelectedGuest: (guest: Guest | null) => void; // Update to allow null
}

const PartyDropdown: React.FC<PartyDropdownProps> = ({ setSelectedGuest }) => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchGuests() {
            setLoading(true);
            try {
                const response = await fetch('/api/party');
                if (!response.ok) throw new Error('Failed to fetch guests');
                
                const data: Guest[] = await response.json();
                setGuests(data);
            } catch (error) {
                console.error('Error fetching guests:', error);
                setGuests([]); // Set guests to empty array in case of error
            }
            setLoading(false);
        };

        fetchGuests();
    }, []);

    const handleDelete = async (guestId: number) => {
        if (!confirm("Are you sure you want to delete this guest?")) return;
        try {
            const response = await fetch(`/api/removeGuest?id=${guestId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete guest');

            // Refresh guest list or remove deleted guest from state
            setGuests(guests.filter(guest => guest.id !== guestId));
        } catch (error) {
            console.error('Error deleting guest:', error);
        }
    };

    return (
        <div className="mt-10 w-full">
            <div className="flex justify-center">
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
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold py-2 px-8 bg-red-500 text-white rounded-full">
                    Remove Party Members
                </h1>
            </div>
            <div className="flex flex-col items-center mt-6">
                {loading ? (
                    <div>Loading guests...</div>
                ) : (
                    guests.map(guest => (
                        <div key={guest.id} className="flex items-center justify-between w-full max-w-md px-4 py-2 bg-white rounded-lg shadow mb-2">
                            <span className="text-green-800 font-medium">{guest.first_name} {guest.last_name}</span>
                            <button 
                                onClick={() => handleDelete(guest.id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PartyDropdown;
