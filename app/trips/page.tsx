'use client';
import React, { useState, useEffect } from 'react';
import PartyTwo from '@/components/PartyTwo';  // Adjust path as needed
import { Guest } from '@/components/Guest';  // Adjust path as needed
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
                const response = await fetch('/api/trips');
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
            const response = await fetch('/api/registerTrip', {
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
                <PartyTwo setSelectedGuest={setSelectedGuest} />
                <a 
                    href="https://docs.google.com/document/d/1wDAyyI5sXilXUd2Kj5srhBPbfSaAh-j9CE1B7doxDSc/edit#heading=h.h5z4n4udcq2g" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 w-full md:w-auto my-4">
                    Learn More About Trips
                </a>
                <label htmlFor="firstChoice" className="block text-blue-800 font-medium py-2 pl-7 text-lg">
                    First Choice Trip:
                </label>
                <select
                    id="firstChoice"
                    className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={firstChoice || ''}
                    onChange={e => setFirstChoice(Number(e.target.value))}
                >
                    <option value="" disabled>
                        Select a trip
                    </option>
                    {trips.map(trip => (
                        <option key={trip.id} value={trip.id}>
                            {trip.name} - Age limit: {trip.age_limit}
                        </option>
                    ))}
                </select>
                <label htmlFor="secondChoice" className="block text-blue-800 font-medium py-2 pl-7 text-lg">
                    Second Choice Trip:
                </label>
                <select
                    id="secondChoice"
                    className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={secondChoice || ''}
                    onChange={e => setSecondChoice(Number(e.target.value))}
                >
                    <option value="" disabled>
                        Select a trip
                    </option>
                    {trips.map(trip => (
                        <option key={trip.id} value={trip.id}>
                            {trip.name} - Age limit: {trip.age_limit}
                        </option>
                    ))}
                </select>
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-lg transition ease-in-out duration-150 active:bg-green-800 focus:outline-none focus:shadow-outline"
                    onClick={handleRegistration}
                >
                    Register for Trips
                </button>
            </div>
            {/* Right Column for Instructions */}
            <div className="w-2/5 bg-green-100 p-8 text-green-800">
                <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                <p className="text-lg leading-relaxed">
                    Select a guest and their first and second choice trips from the dropdowns to register.
                </p>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <p>{modalMessage}</p>
                        <button
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setModalOpen(false)}
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
