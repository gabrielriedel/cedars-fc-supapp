'use client'
import React, { useState } from 'react';

interface UserFormData {
    activityName: string;
    capacity: string;
    hour: string;
    day: string;
    description: string;
    attire: string;
    location: string;
    ageLimit: string;
}

const ActivityCreate: React.FC = () => {
    const [formData, setFormData] = useState<UserFormData>({ activityName: '', capacity: '', hour: '', day: '', description: '', attire: '', location: '', ageLimit: ''});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();  // Prevent the default form submission behavior

        // Validate the input
        if (!formData.activityName || !formData.capacity || !formData.hour || !formData.day || !formData.description || !formData.location || !formData.ageLimit) {
            alert('All fields are required!');
            return;
        }

        try {
            const response = await fetch('/api/createActivity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create activity');
            }

            const result = await response.json();
            alert('Activity added successfully!');
            console.log(result);  // Log or handle response data as needed
            setFormData({ activityName: '', capacity: '', hour: '', day: '', description: '', attire: '', location: '', ageLimit: ''});  // Clear the form
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to create activity');
        }
    };

    return (
        <div className="w-full h-full flex justify-center items-center">
            <form onSubmit={handleSubmit} className="animate-in flex flex-col justify-center gap-2 bg-white shadow-lg rounded-lg p-4 w-full max-w-lg">
                <div className="mb-2">
                    <label className="text-sm font-medium block mb-1" htmlFor="activityName">Activity Name:</label>
                    <input
                        className="rounded-md px-3 py-1 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
                        type="text"
                        id="activityName"
                        name="activityName"
                        value={formData.activityName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="text-sm font-medium block mb-1" htmlFor="capacity">Capacity:</label>
                    <input
                        className="rounded-md px-3 py-1 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
                        type="text"
                        id="capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="text-sm font-medium block mb-1" htmlFor="hour">Hour:</label>
                    <select
                        className="rounded-md px-3 py-1 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
                        id="hour"
                        name="hour"
                        value={formData.hour}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Hour</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div className="mb-2">
                    <label className="text-sm font-medium block mb-1" htmlFor="day">Day:</label>
                    <select
                        className="rounded-md px-3 py-1 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
                        id="day"
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                    </select>
                </div>
                <div className="mb-2">
                    <label className="text-sm font-medium block mb-1" htmlFor="description">Description:</label>
                    <input
                        className="rounded-md px-3 py-1 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-2">
                    <label className="text-sm font-medium block mb-1" htmlFor="attire">What to wear:</label>
                    <input
                        className="rounded-md px-3 py-1 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
                        type="text"
                        id="attire"
                        name="attire"
                        value={formData.attire}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-2">
                    <label className="text-sm font-medium block mb-1" htmlFor="location">Location:</label>
                    <input
                        className="rounded-md px-3 py-1 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-2">
                    <label className="text-sm font-medium block mb-1" htmlFor="ageLimit">Grade Limit:</label>
                    <select
                        className="rounded-md px-3 py-1 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
                        id="ageLimit"
                        name="ageLimit"
                        value={formData.ageLimit}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select grade</option>
                        <option value="No Limit">No Limit</option>
                        <option value="Infant">Infant</option>
                        <option value="Toddler">Toddler</option>
                        <option value="Pre-K">Pre-K</option>
                        <option value="K">K</option>
                        <option value="1st Grade">1st Grade</option>
                        <option value="2nd Grade">2nd Grade</option>
                        <option value="3rd Grade">3rd Grade</option>
                        <option value="4th Grade">4th Grade</option>
                        <option value="5th Grade">5th Grade</option>
                        <option value="6th Grade">6th Grade</option>
                        <option value="7th Grade">7th Grade</option>
                        <option value="8th Grade">8th Grade</option>
                        <option value="High School">High School</option>
                        <option value="College">College</option>
                        <option value="Adult">Adult</option>
                    </select>
                </div>
                
                <button type="submit" className="bg-green-700 hover:bg-green-800 rounded-md px-4 py-2 text-white transition-colors w-full">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ActivityCreate;
