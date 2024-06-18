
'use client'
import React, { useState } from 'react';
import ActivitiesComponent from '@/components/ActivitiesComponent';
import PartyDropdown from '@/components/PartyDropdown';
import { Guest } from '@/components/Guest';

const Page: React.FC = () => {
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

    return (
        <div>
            <PartyDropdown setSelectedGuest={setSelectedGuest} />
            <ActivitiesComponent selectedGuest={selectedGuest} />
        </div>
    );
};

export default Page;
