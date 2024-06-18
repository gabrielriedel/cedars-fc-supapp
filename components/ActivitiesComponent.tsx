// /components/ActivitiesComponent.tsx
'use client';

import React, { useEffect, useState } from 'react';
import DropdownMenu from './DropdownMenu'; 
import { Guest } from '@/components/Guest';

interface Activity {
    id: number;
    activity_name: string;
    spaces_left: number;
}

interface ActivitiesComponentProps {
    selectedGuest: Guest | null;
}

const ActivitiesComponent: React.FC<ActivitiesComponentProps> = ({ selectedGuest }) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;  // To prevent state update if the component is unmounted
        async function fetchData() {
            try {
                const response = await fetch('/api/catalog');
                if (!response.ok) throw new Error('Failed to fetch activities');
                const data: Activity[] = await response.json();
                if (isMounted) setActivities(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();
        return () => { isMounted = false; };  // Cleanup function to toggle the mounted state
    }, []);

    const handleActivityUpdate = async (activityId: number, activityName: string) => {
        if (!selectedGuest) {
            console.error('No guest selected');
            return;
        }
        
        try {
            const response = await fetch(`/api/registerActivities`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: selectedGuest.first_name,
                    lastName: selectedGuest.last_name,
                    activityName,
                    activityId
                }),
            });

            if (!response.ok) throw new Error('Failed to update activity');
            // Optionally, handle the response data if needed
        } catch (err) {
            if (err instanceof Error) {
                console.error('Failed to update activity:', err.message);
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!activities.length) return <div>No activities found.</div>;

    return (
        <div>
            <DropdownMenu 
                activities={activities.map(activity => ({ 
                    id: activity.id, 
                    activity_name: activity.activity_name 
                }))}
                onSelect={(activity) => handleActivityUpdate(activity.id, activity.activity_name)}
            />
            <ul>
                {activities.map(activity => (
                    <li key={activity.id}>
                        {activity.activity_name} - Spaces left: {activity.spaces_left}
                    </li>
                ))}
            </ul>
        </div>
    );
    
};

export default ActivitiesComponent;
