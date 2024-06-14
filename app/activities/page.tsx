// pages/activities.tsx
import React from 'react';
import ActivitiesComponent from '@/components/ActivitiesComponent'; // Ensure the path is correct based on your project structure

const ActivitiesPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center my-6">Browse Activities</h1>
            <ActivitiesComponent />
        </div>
    );
};

export default ActivitiesPage;
