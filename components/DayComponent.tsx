import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Ensure this path is correct
import './DayComponent.css';
import { Guest } from '@/components/Guest';

interface Activity {
    id: number;
    activity_name: string;
    spaces_left: number;
    description: string;
}

interface DayComponentProps {
    day: string;
    hours: number[];
    selectedGuest: Guest | null;
    isSelectedDay: boolean;
    toggleSelectedDay: () => void;
}

const DayComponent: React.FC<DayComponentProps> = ({ day, hours, selectedGuest, isSelectedDay, toggleSelectedDay }) => {
    const [activities, setActivities] = useState<Activity[][]>([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedHour, setSelectedHour] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [hoveredActivity, setHoveredActivity] = useState<number | null>(null);

    useEffect(() => {
        async function fetchActivities() {
            if (!isSelectedDay) return;
            setLoading(true);
            try {
                const responses = await Promise.all(
                    hours.map(hour =>
                        fetch('/api/catalog', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ day, hour })
                        })
                        .then(res => res.ok ? res.json() : Promise.reject('Failed to load'))
                        .catch(err => {
                            console.error('Error fetching activities for hour', hour, ':', err);
                            return []; // Return an empty array on error
                        })
                    )
                );
                setActivities(responses);
            } catch (error) {
                console.error('Failed to fetch activities:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchActivities();
    }, [day, hours, isSelectedDay]);

    const handleActivityRegistration = async (activityId: number, activityName: string, hour: number, day: string) => {
        if (!selectedGuest) {
            setModalMessage('No guest selected!');
            setModalOpen(true);
            return;
        }

        try {
            const response = await fetch('/api/registerActivities', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: selectedGuest.first_name,
                    lastName: selectedGuest.last_name,
                    grade: selectedGuest.grade,
                    guest_id: selectedGuest.id,
                    activityName,
                    activityId,
                    day,
                    hour
                })
            });

            if (!response.ok) {
                const errMsg = await response.text();
                throw new Error(errMsg);
            }
            setModalMessage("Registration successful!");
            setModalOpen(true);
        } catch (err: unknown) { // Specifying 'unknown' is optional as it's the default type for errors now
            console.error('Failed to register activity:', err);
            if (err instanceof Error) {
                setModalMessage(err.message);
            } else {
                setModalMessage("An unexpected error occurred");
            }
            setModalOpen(true);
        }
    };

    if (isLoading && isSelectedDay) return <div>Loading activities for {day}...</div>;

    return (
        <div className="w-full max-w-md px-8">
            <h3 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-lg transition ease-in-out duration-150 active:bg-blue-800 focus:outline-none focus:shadow-outline mb-4 mt-4 text-center" onClick={toggleSelectedDay}>
                {day}
            </h3>
            {isSelectedDay && hours.map((hour, index) => (
                <div key={hour} className="mt-3 pl-4">
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-lg transition ease-in-out duration-150 active:bg-red-800 focus:outline-none focus:shadow-outline" 
                        onClick={() => setSelectedHour(selectedHour === hour ? null : hour)}
                        aria-expanded={selectedHour === hour}
                    >
                        Hour {hour}
                    </button>
                    {selectedHour === hour && (
                        <ul className="pl-4">
                            {activities[index] && activities[index].length > 0 ? activities[index].map(activity => (
                                <li 
                                    key={activity.id} 
                                    className="mt-2 relative group"
                                    onMouseEnter={() => setHoveredActivity(activity.id)}
                                    onMouseLeave={() => setHoveredActivity(null)}
                                >
                                    <button 
                                        className="activity-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-lg transition ease-in-out duration-150 active:bg-green-800 focus:outline-none focus:shadow-outline" 
                                        onClick={() => handleActivityRegistration(activity.id, activity.activity_name, hour, day)}
                                    >
                                        {activity.activity_name} - Spaces left: {activity.spaces_left}
                                    </button>
                                    {hoveredActivity === activity.id && (
                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-green-200 text-black p-2 rounded shadow-lg transition-opacity duration-300 opacity-100">
                                            <span className="text-sm">{`Description: ${activity.description}`}</span>
                                        </div>
                                    )}
                                </li>
                            )) : <li className="no-activities text-gray-500 pl-4">No activities this hour.</li>}
                        </ul>
                    )}
                </div>
            ))}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <p>{modalMessage}</p>
            </Modal>
        </div>
    );
};


export default DayComponent;
