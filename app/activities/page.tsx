'use client'
import React, { useState } from 'react';
import PartyDropdown from '@/components/PartyDropdown';
import { Guest } from '@/components/Guest';
import DayComponent from '@/components/DayComponent';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hoursOfDay = [1, 2, 3, 4, 5];

const Page: React.FC = () => {
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

    return (
        <div>
            <PartyDropdown setSelectedGuest={setSelectedGuest} />
            {daysOfWeek.map(day => (
                <DayComponent key={day} day={day} hours={hoursOfDay} selectedGuest={selectedGuest} />
            ))}
        </div>
    );
};

export default Page;

