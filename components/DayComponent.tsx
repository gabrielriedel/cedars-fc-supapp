import React, { useState, useEffect } from 'react';
import './DayComponent.css'; // Importing CSS

interface Activity {
    id: number;
    activity_name: string;
    spaces_left: number;
}

interface Guest {
    first_name: string;
    last_name: string;
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
            console.error('No guest selected');
            return;
        }

        try {
            const response = await fetch('/api/registerActivities', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: selectedGuest.first_name,
                    lastName: selectedGuest.last_name,
                    activityName,
                    activityId,
                    day,
                    hour
                })
            });

            if (!response.ok) throw new Error('Failed to register activity');
            alert("Registration successful!");
        } catch (err) {
            console.error('Failed to register activity:', err);
        }
    };

    if (isLoading && isSelectedDay) return <div>Loading activities for {day}...</div>;

    return (
        <div className="pl-10"> 
            <h3 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-lg transition ease-in-out duration-150 active:bg-blue-800 focus:outline-none focus:shadow-outline mb-4 mt-4 text-center" onClick={toggleSelectedDay}>
                {day}
            </h3>
            {isSelectedDay && hours.map((hour, index) => (
                <div key={hour} className="mt-3 pl-4">  
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-lg transition ease-in-out duration-150 active:bg-red-800 focus:outline-none focus:shadow-outline" onClick={() => setSelectedHour(selectedHour === hour ? null : hour)}>
                        Hour {hour}
                    </button>
                    {selectedHour === hour && (
                        <ul className="pl-4"> 
                            {activities[index] && activities[index].length > 0 ? activities[index].map(activity => (
                                <li key={activity.id} className="mt-2">
                                    <button className="activity-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-lg transition ease-in-out duration-150 active:bg-green-800 focus:outline-none focus:shadow-outline" onClick={() => handleActivityRegistration(activity.id, activity.activity_name, hour, day)}>
                                        {activity.activity_name} - Spaces left: {activity.spaces_left}
                                    </button>
                                </li>
                            )) : <li className="no-activities text-gray-500 pl-4">No activities this hour.</li>}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
    
    
    
};

export default DayComponent;
