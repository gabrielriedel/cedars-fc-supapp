'use client'
import React, { useState } from 'react';
import DayComponent from '@/components/DayComponent';  // Adjust path as needed
import PartyDropdown from '@/components/PartyDropdown';  // Adjust path as needed
import { Guest } from '@/components/Guest';  // Adjust path as needed

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hoursOfDay = [1, 2, 3, 4, 5];

const Page: React.FC = () => {
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    const toggleSelectedDay = (day: string) => {
        setSelectedDay(selectedDay === day ? null : day);
    };

    return (
        <div className="flex flex-col items-start justify-start w-full ml-20">
            <PartyDropdown setSelectedGuest={setSelectedGuest} />
            {daysOfWeek.map(day => (
                <DayComponent
                    key={day}
                    day={day}
                    hours={hoursOfDay}
                    selectedGuest={selectedGuest}
                    isSelectedDay={selectedDay === day}
                    toggleSelectedDay={() => toggleSelectedDay(day)}
                />
            ))}
        </div>
    );
    
    
    
};

export default Page;
