import React, { useState, useEffect } from 'react';

interface Activity {
    id: number;
    activity_name: string;
    spaces_left: number;
}

interface Guest {
    first_name: string;
    last_name: string;
    // Other properties...
}

interface DayComponentProps {
    day: string;
    hours: number[];
    selectedGuest: Guest | null;  // Passing selectedGuest as a prop
}

const DayComponent: React.FC<DayComponentProps> = ({ day, hours, selectedGuest }) => {
    const [activities, setActivities] = useState<Activity[][]>([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedHour, setSelectedHour] = useState<number | null>(null);

    useEffect(() => {
        async function fetchActivities() {
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
    }, [day, hours]);

    const handleActivityRegistration = async (activityId: number, activityName: string) => {
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
                    activityId
                })
            });

            if (!response.ok) throw new Error('Failed to register activity');
            alert("Registration successful!"); // Optionally update UI or alert user
        } catch (err) {
            console.error('Failed to register activity:', err);
        }
    };

    if (isLoading) return <div>Loading activities for {day}...</div>;

    return (
        <div>
            <h3>{day}</h3>
            {hours.map((hour, index) => (
                <div key={hour}>
                    <button onClick={() => setSelectedHour(selectedHour === hour ? null : hour)}>
                        Hour {hour}
                    </button>
                    {selectedHour === hour && (
                        <ul>
                            {activities[index] && activities[index].length > 0 ? activities[index].map(activity => (
                                <button key={activity.id} onClick={() => handleActivityRegistration(activity.id, activity.activity_name)} style={{ display: 'block', margin: '5px', padding: '10px', background: 'lightgray', cursor: 'pointer' }}>
                                    {activity.activity_name} - Spaces left: {activity.spaces_left}
                                </button>
                            )) : <li>No activities this hour.</li>}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DayComponent;
