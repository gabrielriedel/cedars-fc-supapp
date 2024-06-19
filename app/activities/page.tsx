'use client'
import React, { useState } from 'react';
import DayComponent from '@/components/DayComponent';  // Adjust path as needed
import PartyDropdown from '@/components/PartyDropdown';  // Adjust path as needed
import { Guest } from '@/components/Guest';  // Adjust path as needed
import Link from "next/link";
import Header from '@/components/Header';

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
        </svg>{" "}
        Back
      </Link>
            <PartyDropdown setSelectedGuest={setSelectedGuest} />
            <label htmlFor="guestSelect" className="block text-black font-medium py-2 pl-7">
                        Choose Activities:
            </label>
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
