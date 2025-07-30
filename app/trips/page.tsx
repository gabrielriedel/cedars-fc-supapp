'use client';
import React, { useState, useEffect } from 'react';
import PartyTwo from '@/components/PartyTwo';
import { Guest } from '@/components/Guest';
import Link from "next/link";

interface Trip {
  id: number;
  name: string;
  age_limit: string;
}

const Page: React.FC = () => {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [firstChoice, setFirstChoice] = useState<number | null>(null);
  const [secondChoice, setSecondChoice] = useState<number | null>(null);
  const [modalMessage, setModalMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      try {
        const response = await fetch('/api/familyCamp/trips');
        if (!response.ok) throw new Error('Failed to fetch trips');
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  const handleRegistration = async () => {
    if (!selectedGuest) {
      setModalMessage('No guest selected!');
      setModalOpen(true);
      return;
    }
    if (!firstChoice || !secondChoice) {
      setModalMessage('Please select both first and second choice trips!');
      setModalOpen(true);
      return;
    }
    const firstTrip = trips.find(trip => trip.id === firstChoice);
    const secondTrip = trips.find(trip => trip.id === secondChoice);
    try {
      const response = await fetch('/api/familyCamp/registerTrip', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: selectedGuest.id,
          firstName: selectedGuest.first_name,
          lastName: selectedGuest.last_name,
          grade: selectedGuest.grade,
          firstChoice: {
            id: firstChoice,
            name: firstTrip?.name,
            age_limit: firstTrip?.age_limit
          },
          secondChoice: {
            id: secondChoice,
            name: secondTrip?.name,
            age_limit: secondTrip?.age_limit
          }
        })
      });
      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg);
      }
      setModalMessage("Registration successful!");
    } catch (err: unknown) {
      console.error('Failed to register trips:', err);
      if (err instanceof Error) {
        setModalMessage(err.message);
      } else {
        setModalMessage("An unexpected error occurred");
      }
    } finally {
      setModalOpen(true);
    }
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

      {/* Guest Selection */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6 mb-8">
        <PartyTwo setSelectedGuest={setSelectedGuest} />
      </div>

      {/* Learn More Button */}
      <a 
        href="https://docs.google.com/document/d/1qfrNSjbw3rp7n3G6Uu1VkvJeVd8ELejbH38hymCQ1WY/edit?usp=sharing" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors duration-200 mb-6"
      >
        Learn More About Trips
      </a>

      {/* Trip Selection */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6 space-y-6">
        <div>
          <label htmlFor="firstChoice" className="block text-green-900 font-semibold mb-2">
            First Choice Trip:
          </label>
          <select
            id="firstChoice"
            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            value={firstChoice || ''}
            onChange={e => setFirstChoice(Number(e.target.value))}
          >
            <option value="" disabled>Select a trip</option>
            {trips.map(trip => (
              <option key={trip.id} value={trip.id}>
                {trip.name} - Age Min: {trip.age_limit}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="secondChoice" className="block text-green-900 font-semibold mb-2">
            Second Choice Trip:
          </label>
          <select
            id="secondChoice"
            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            value={secondChoice || ''}
            onChange={e => setSecondChoice(Number(e.target.value))}
          >
            <option value="" disabled>Select a trip</option>
            {trips.map(trip => (
              <option key={trip.id} value={trip.id}>
                {trip.name} - Age Min: {trip.age_limit}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRegistration}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow transition"
        >
          Register for Trips
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <p className="text-center text-green-900 mb-4">{modalMessage}</p>
            <button
              onClick={() => setModalOpen(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;