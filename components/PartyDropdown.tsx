'use client'

import React, { useEffect, useState } from 'react';
import { Guest } from '@/components/Guest';

interface PartyDropdownProps {
    setSelectedGuest: (guest: Guest | null) => void; // Update to allow null
}

const PartyDropdown: React.FC<PartyDropdownProps> = ({ setSelectedGuest }) => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedValue, setSelectedValue] = useState(''); // State to keep track of the selected option

    useEffect(() => {
        const fetchGuests = async () => {
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

    const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value);
        const selectedId = parseInt(event.target.value, 10);
        const selectedGuest = guests.find(guest => guest.id === selectedId);
        setSelectedGuest(selectedGuest || null); // Pass null if no guest is found
    };

    return (
        <div className="flex flex-col space-y-2">
    <label htmlFor="guestSelect" className="block text-sm font-medium text-gray-700">Choose a guest:</label>
    <select id="guestSelect" name="guests" value={selectedValue} onChange={handleSelection} disabled={loading} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
        <option value="">Select a guest</option> {/* Default unselected option */}
        {loading ? (
            <option>Loading guests...</option>
        ) : (
            guests.map((guest, index) => (
                <option key={index} value={guest.id}>{guest.first_name} {guest.last_name}</option>
            ))
        )}
    </select>
</div>

    );
};

export default PartyDropdown;
