'use client'

import React, { useEffect, useState } from 'react';
import { Guest } from '@/components/Guest';

interface PartyDropdownProps {
    setSelectedGuest: (guest: Guest | null) => void; // Update to allow null
}

const PartyTwo: React.FC<PartyDropdownProps> = ({ setSelectedGuest }) => {
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
        <div className="mt-10 w-full">
        <div className="flex justify-center">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold py-2 px-8 bg-green-500 text-white rounded-full">
                Register for trips!
            </h1>
        </div>
        <div className="flex justify-start">
            <div className="flex flex-col space-y-2 w-full max-w-md px-8">
                <label htmlFor="guestSelect" className="block text-black font-medium py-2">
                    Choose a party member to register for:
                </label>
                <select id="guestSelect" name="guests" value={selectedValue} onChange={handleSelection} disabled={loading} className="mt-1 block w-full pl-3 pr-10 py-2 text-white bg-green-500 hover:bg-green-700 focus:bg-green-600 border-none focus:outline-none focus:ring-2 focus:ring-green-700 rounded-md">
                    <option value="">Select a party member</option> {/* Default unselected option */}
                    {loading ? (
                        <option>Loading guests...</option>
                    ) : (
                        guests.map((guest, index) => (
                            <option key={index} value={guest.id} className="bg-white text-black">
                                {guest.first_name} {guest.last_name}
                            </option>
                        ))
                    )}
                </select>
            </div>
        </div>
    </div>
    

    );
    
    
    
};

export default PartyTwo;
