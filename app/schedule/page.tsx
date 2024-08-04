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
      <div className="flex w-full min-h-screen bg-white text-green-800">
          <div className="flex flex-col pl-20 pt-8 w-full">
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
                  Back to dashboard
              </Link>
              <ScheduleDropdown setSelectedGuest={setSelectedGuest} setSelectedDay={setSelectedDay} />
          </div>
      </div>
  );
};

export default Page;
