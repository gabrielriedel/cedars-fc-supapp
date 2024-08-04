'use client'
import React, { useEffect, useState } from 'react';
import { Guest } from '@/components/Guest';

interface ScheduleDropdownProps {
    setSelectedGuest: (guest: Guest | null) => void;
    setSelectedDay: (day: string) => void;
}

const ScheduleDropdown: React.FC<ScheduleDropdownProps> = ({ setSelectedGuest, setSelectedDay }) => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDay, setSelectedDayState] = useState<string>('');
    const [schedules, setSchedules] = useState<{ guest_id: number, first_name: string, last_name: string, hour: string, activity_name: string, location: string, attire: string }[]>([]);
    const [schedulesLoading, setSchedulesLoading] = useState<boolean>(false);
    const [titleVisible, setTitleVisible] = useState<boolean>(false);
    const [familyCode, setFamilyCode] = useState<string | null>(null);


    useEffect(() => {
        const fetchGuests = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/party');
                if (!response.ok) throw new Error('Failed to fetch guests');
                
                const data: Guest[] = await response.json();
                setGuests(data);
            } catch (error) {
                console.error('Error fetching guests:', error);
                setGuests([]); // Set guests to empty array in case of error
            }
            setLoading(false);
        };

        fetchGuests();
    }, []);

    const handleDaySelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(event.target.value);
        setSelectedDayState(event.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedDay) {
            alert('Please select a day.');
            return;
        }

        setSchedulesLoading(true);
        setTitleVisible(true);

        try {
            const response = await fetch('/api/guestSchedules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ day: selectedDay }),
            });

            if (!response.ok) throw new Error('Failed to fetch schedules');
            
            const data = await response.json();
            setSchedules(data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setSchedules([]);
        }
        setSchedulesLoading(false);
    };

    return (
        <div className="w-full">
            <div className="mt-10 w-full">
                <div className="flex justify-center">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold py-2 px-8 bg-green-500 text-white rounded-full">
                        View Family Activity Schedules!
                    </h1>
                </div>
                <div className="flex justify-start mt-4">
                    <div className="flex flex-col space-y-2 w-full max-w-md px-8">
                        <label htmlFor="daySelect" className="block text-black font-medium py-2">
                            Choose a day of the week:
                        </label>
                        <select id="daySelect" name="days" onChange={handleDaySelection} className="mt-1 block w-full pl-3 pr-10 py-2 text-white bg-green-500 hover:bg-green-700 focus:bg-green-600 border-none focus:outline-none focus:ring-2 focus:ring-green-700 rounded-md">
                            <option value="">Select a day</option>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day, index) => (
                                <option key={index} value={day} className="bg-white text-black">
                                    {day}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    <button onClick={handleSubmit} className="py-2 px-8 bg-green-500 text-white hover:bg-green-700 focus:bg-green-600 rounded-full">
                        Submit
                    </button>
                </div>
                {titleVisible && selectedDay && (
                    <div className="flex justify-center mt-6">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold border-b-2 border-green-500 pb-2">
                            Schedules for Family on {selectedDay}
                        </h2>
                    </div>
                )}
                {schedulesLoading ? (
                    <div className="flex justify-center mt-4">Loading schedules...</div>
                ) : (
                    schedules.length > 0 && (
                        <div className="mt-8 w-full max-w-6xl mx-auto">
                            {schedules.reduce((acc, curr) => {
                                const guestIndex = acc.findIndex(guest => guest.guest_id === curr.guest_id);
                                if (guestIndex > -1) {
                                    acc[guestIndex].activities.push(curr);
                                } else {
                                    acc.push({ guest_id: curr.guest_id, first_name: curr.first_name, last_name: curr.last_name, activities: [curr] });
                                }
                                return acc;
                            }, [] as { guest_id: number, first_name: string, last_name: string, activities: any[] }[]).map((guest, index) => (
                                <div key={index} className="mb-8 border border-green-500 p-4 rounded-md">
                                    <h3 className="text-lg font-bold mb-2">
                                        {guest.first_name} {guest.last_name}
                                    </h3>
                                    <table className="min-w-full bg-white border border-green-500 mb-4">
                                        <thead className="bg-green-500 text-white">
                                            <tr>
                                                <th className="py-2 px-4 border-b border-green-500">Hour</th>
                                                <th className="py-2 px-4 border-b border-green-500">Activity</th>
                                                <th className="py-2 px-4 border-b border-green-500">Location</th>
                                                <th className="py-2 px-4 border-b border-green-500">What to wear</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guest.activities.map((activity, idx) => (
                                                <tr key={idx} className="even:bg-green-100">
                                                    <td className="py-2 px-4 border-b border-green-500">{activity.hour}</td>
                                                    <td className="py-2 px-4 border-b border-green-500">{activity.activity_name}</td>
                                                    <td className="py-2 px-4 border-b border-green-500">{activity.location}</td>
                                                    <td className="py-2 px-4 border-b border-green-500">{activity.attire}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ScheduleDropdown;