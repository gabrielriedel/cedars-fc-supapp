// ScheduleDropdown.tsx
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
    const [selectedGuest, setSelectedGuestState] = useState<Guest | null>(null);
    const [selectedDay, setSelectedDayState] = useState<string>('');
    const [activities, setActivities] = useState<{ hour: string, activity_name: string }[]>([]);
    const [activitiesLoading, setActivitiesLoading] = useState<boolean>(false);

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

    const handleGuestSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(event.target.value, 10);
        const selectedGuest = guests.find(guest => guest.id === selectedId);
        setSelectedGuest(selectedGuest || null); // Pass null if no guest is found
        setSelectedGuestState(selectedGuest || null);
    };

    const handleDaySelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(event.target.value);
        setSelectedDayState(event.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedGuest || !selectedDay) {
            alert('Please select a guest and a day.');
            return;
        }

        setActivitiesLoading(true);
        console.log(selectedGuest.id);
        try {
            const response = await fetch('/api/scheduleView', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ guest_id: selectedGuest.id, day: selectedDay }),
            });

            if (!response.ok) throw new Error('Failed to fetch activities');
            
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setActivities([]);
        }
        setActivitiesLoading(false);
    };

    return (
        <div className="w-full">
            <div className="mt-10 w-full">
                <div className="flex justify-center">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold py-2 px-8 bg-green-500 text-white rounded-full">
                        View Your Activity Schedule!
                    </h1>
                </div>
                <div className="flex justify-start mt-4">
                    <div className="flex flex-col space-y-2 w-full max-w-md px-8">
                        <label htmlFor="guestSelect" className="block text-black font-medium py-2">
                            Choose a party member to register for:
                        </label>
                        <select id="guestSelect" name="guests" onChange={handleGuestSelection} disabled={loading} className="mt-1 block w-full pl-3 pr-10 py-2 text-white bg-green-500 hover:bg-green-700 focus:bg-green-600 border-none focus:outline-none focus:ring-2 focus:ring-green-700 rounded-md">
                            <option value="">Select a party member</option>
                            {loading ? (
                                <option>Loading guests...</option>
                            ) : (
                                guests.map((guest, index) => (
                                    <option key={index} value={guest.id} className="bg-white text-black">
                                        {guest.first_name} {guest.last_name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
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
                {activitiesLoading ? (
                    <div className="flex justify-center mt-4">Loading activities...</div>
                ) : (
                    activities.length > 0 && (
                        <div className="mt-8 w-full max-w-md mx-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">Hour</th>
                                        <th className="py-2 px-4 border-b">Activity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map((activity, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4 border-b">{activity.hour}</td>
                                            <td className="py-2 px-4 border-b">{activity.activity_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ScheduleDropdown;
