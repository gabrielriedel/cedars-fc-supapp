'use client'

import React, { useEffect, useState } from 'react';

interface Activity {
    id: number;
    activity_name: string;
    spots_left: number;
}

const ActivitiesComponent: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/catalog');
            const data: Activity[] = await response.json();
            setActivities(data);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (!activities.length) return <div>No activities found.</div>;

    return (
        <div>
            <h1>Activities</h1>
            <ul>
                {activities.map(activity => (
                    <li key={activity.id}>
                        {activity.activity_name} - Spots left: {activity.spots_left}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivitiesComponent;
