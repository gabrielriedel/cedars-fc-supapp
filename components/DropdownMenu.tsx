// /components/DropdownMenu.tsx
import React, { useState } from 'react';

interface Activity {
    id: number;
    activity_name: string;
}

interface DropdownMenuProps {
    activities: Activity[];
    onSelect: (activity: Activity) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ activities, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none">
                Activities
            </button>
            {isOpen && (
                <ul className="absolute right-0 w-48 mt-2 bg-white shadow-lg rounded z-50">
                    {activities.map((activity) => (
                        <li key={activity.id} className="w-full">
                            <button
                                type="button"
                                className="text-left px-4 py-2 hover:bg-gray-100 cursor-pointer block w-full"
                                onClick={() => {
                                    console.log(activity);
                                    onSelect(activity);
                                    setIsOpen(false);  // Optionally close the dropdown after selection
                                }}
                            >
                                {activity.activity_name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;
