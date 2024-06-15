'use client'

import React, { useEffect, useState } from 'react';

interface Guest {
    first_name: string;
    last_name: string;
}

const PartyDropdown: React.FC = () => {
    const [guests, setGuests] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGuests = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/party');
                if (!response.ok) throw new Error('Failed to fetch guests');
                
                const data: Guest[] = await response.json();
                const guestNames = data.map(guest => `${guest.first_name} ${guest.last_name}`);
                setGuests(guestNames);
            } catch (error) {
                console.error('Error fetching guests:', error);
                setGuests([]); // Set guests to empty array in case of error
            }
            setLoading(false);
        };

        fetchGuests();
    }, []);

    return (
        <div>
            <label htmlFor="guestSelect">Choose a guest:</label>
            <select id="guestSelect" name="guests" disabled={loading}>
                {loading ? (
                    <option>Loading guests...</option>
                ) : (
                    guests.map((name, index) => (
                        <option key={index} value={name}>{name}</option>
                    ))
                )}
            </select>
        </div>
    );
};

export default PartyDropdown;
