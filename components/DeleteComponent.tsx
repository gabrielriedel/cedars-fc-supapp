// components/DeleteComponent.client.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { Guest } from '@/components/Guest';  // Adjust path as needed
import Link from "next/link";

interface PartyDropdownProps {
    setSelectedGuest: (guest: Guest | null) => void;  // This prop might not be used if you're just deleting
}

const PartyDropdown: React.FC<PartyDropdownProps> = ({ setSelectedGuest }) => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGuests() {
            setLoading(true);
            try {
                const response = await fetch('/api/party');
                if (!response.ok) throw new Error('Failed to fetch guests');
                
                const data = await response.json() as Guest[];
                setGuests(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching guests:', error);
                setGuests([]);
                setLoading(false);
            }
        }
        fetchGuests();
    }, []);

    const handleDelete = async (guestId: number) => {
        if (!confirm("Are you sure you want to delete this guest?")) return;
        try {
            const response = await fetch(`/api/removeGuest?id=${guestId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete guest');

            setGuests(currentGuests => currentGuests.filter(guest => guest.id !== guestId));
        } catch (error) {
            console.error('Error deleting guest:', error);
        }
    };

    return (
        <div className="mt-10 w-full flex flex-col items-center">
            {loading ? (
                <div>Loading guests...</div>
            ) : (
                guests.map(guest => (
                    <div key={guest.id} className="flex items-center justify-between w-full max-w-md px-4 py-2 bg-white rounded-lg shadow mb-2">
                        <span className="text-green-800 font-medium">{guest.first_name} {guest.last_name}</span>
                        <button onClick={() => handleDelete(guest.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline transition-colors">
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default PartyDropdown;
