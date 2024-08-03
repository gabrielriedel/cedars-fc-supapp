'use client'
import React, { useState } from 'react';
import DayComponent from '@/components/DayComponent';  // Adjust path as needed
import PartyDropdown from '@/components/PartyDropdown';  // Adjust path as needed
import { Guest } from '@/components/Guest';  // Adjust path as needed
import Link from "next/link";
import Header from '@/components/Header';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const hoursOfDay = [1, 2, 3, 4];

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
              <PartyDropdown setSelectedGuest={setSelectedGuest} />
              <label htmlFor="guestSelect" className="block text-blue-800 font-medium py-2 pl-7 text-lg">
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
          {/* Right Column for Instructions */}
          <div className="w-2/5 bg-green-100 p-8 text-green-800">
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
              <p className="text-lg leading-relaxed">
                  Welcome to the Cedars Family Camp registration system! Here you can select activities for each day and hour.
                  Follow these steps to ensure your party is ready for a fun-filled summer:
              </p>
              <ul className="list-disc pl-4 mt-4">
                  <li>Select a party member from the dropdown on the left.</li>
                  <li>Choose the day and hour to view available activities.</li>
                  <li>Click on an activity to register the selected party member.</li>
                  <li>If you change your mind on your choice of activity, you may select a different one and the change will be made.</li>
                  <li>Refresh the page for the most up to date "spaces left" count</li>
                  <li>If there was an activity that you really wanted to participate in but it was full, then leave a message with that activity so we can make an effort to get you in that activity a different day</li>
              </ul>
              <p className="mt-4">
                  If you have any questions or need further assistance, please contact our support team.
              </p>
          </div>
      </div>
  );
  
  
  
    
    
    
};

export default Page;
