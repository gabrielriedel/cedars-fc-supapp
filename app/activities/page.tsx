'use client'
import React, { useState } from 'react';
import DayComponent from '@/components/DayComponent';  // Adjust path as needed
import PartyDropdown from '@/components/PartyDropdown';  // Adjust path as needed
import { Guest } from '@/components/Guest';  // Adjust path as needed
import Link from "next/link";
import Image from 'next/image';
import logo from '@/assets/cedarslogo.png';

const daysOfWeek = ['Monday', 'Tuesday', 'Thursday'];
const hoursOfDay = [1, 2, 3, 4];

const Page: React.FC = () => {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const toggleSelectedDay = (day: string) => {
    setSelectedDay(selectedDay === day ? null : day);
  };

  return (
    <div className="min-h-screen bg-white text-green-900 py-6 px-4 sm:px-6 lg:px-12 xl:px-20">
      {/* Header */}
      <header className="flex items-center justify-between w-full border-b pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Cedars Logo" width={40} height={40} />
          <h1 className="text-2xl font-semibold">Cedars Family Camp</h1>
        </div>
        <Link
          href="/protected"
          className="text-sm font-medium text-green-800 hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Dashboard
        </Link>
      </header>

      {/* Split layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-10">
        {/* Left: Dropdown and Activity Cards */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-4">
            <PartyDropdown setSelectedGuest={setSelectedGuest} />
            
          </div>
          <div className="flex flex-col gap-6">
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
        </div>

        {/* Right: Instructions */}
        <aside className="lg:w-1/3 bg-green-50 border border-green-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xl font-semibold text-green-800">Instructions</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-green-900 leading-relaxed">
            <li>Add each party member before selecting activities.</li>
            <li>Choose a name using the dropdown on the left.</li>
            <li>Click a time slot to register that person.</li>
            <li>Changes are saved automatically in real-time.</li>
            <li><strong>NOTE:</strong> Wednesday is Trip Day! Return to the Dashboard to find the Trip Day Form and Instructions.</li>
          </ul>
        </aside>
      </div>
    <div className="mt-12 flex justify-center gap-4">
      <a
        href="https://form.jotform.com/242084860452153"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors"
      >
        Step 3: Horse Activity Questionnaire
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-2"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>

      <Link
        href="/trips"
        className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors"
      >
        Step 4: Trip Day Form
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-2"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </div>
    </div>
  );
};

export default Page;