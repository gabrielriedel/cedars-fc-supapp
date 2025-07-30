'use client'
import React, { useState } from 'react';
import ScheduleDropdown from '@/components/ScheduleDropdown'; // Adjust path as needed
import Link from "next/link";
import { Guest } from '@/components/Guest';  // Adjust path as needed

const Page: React.FC = () => {
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    const toggleSelectedDay = (day: string) => {
        setSelectedDay(selectedDay === day ? null : day);
    };

    return (
      <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-b from-green-50 to-white text-green-800 px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <Link
          href="/protected"
          className="self-start mb-6 flex items-center text-sm text-green-700 hover:text-green-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Schedule Dropdown */}
        <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6">
          <ScheduleDropdown setSelectedGuest={setSelectedGuest} setSelectedDay={setSelectedDay} />
        </div>
      </div>
    );
};

export default Page;
