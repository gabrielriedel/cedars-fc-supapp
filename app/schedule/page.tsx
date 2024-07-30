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
          <div className="flex flex-col pl-20 pt-8 w-3/5">
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
          {/* Right Column for Instructions */}
          <div className="w-2/5 bg-green-100 p-8 text-green-800">
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
              <p className="text-lg leading-relaxed">
                  Instructions for viewing your daily schedules
              </p>
              <ul className="list-disc pl-4 mt-4">
                  <li>Select a party member and day from the dropdowns on the left.</li>
                  <li>Your schedule for each hour of the day should appear below.</li>
                  <li>PLEASE NOTE: this is not your finalized schedule. We reserve the right to alter the schedules on the backend as we see necessary.</li>
                  <li>Your finalized daily schedule will be printed and placed in your mailbox each day</li>
              </ul>
              <p className="mt-4">
                  If you have any questions or need further assistance, please contact our support team.
              </p>
          </div>
      </div>
  );
};

export default Page;
