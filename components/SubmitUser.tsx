// /components/SubmitUser.tsx
'use client'
import React, { useState } from 'react';

interface UserFormData {
    firstName: string;
    lastName: string;
    cabin: string;
    age: string;
}

const SubmitUser: React.FC = () => {
    const [formData, setFormData] = useState<UserFormData>({ firstName: '', lastName: '', cabin: '', age: '' });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();  // Prevent the default form submission behavior

        // Validate the input
        if (!formData.firstName || !formData.lastName || !formData.cabin || !formData.age) {
            alert('All fields are required!');
            return;
        }

        // Convert age from string to number and validate
        const age = Number(formData.age);
        if (isNaN(age) || age <= 0) {
            alert('Please enter a valid age.');
            return;
        }

        try {
            const response = await fetch('/api/registerGuest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    cabin: formData.cabin,
                    age
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit guest data');
            }

            const result = await response.json();
            alert('Guest added successfully!');
            console.log(result);  // Log or handle response data as needed
            setFormData({ firstName: '', lastName: '', cabin: '', age: '' });  // Clear the form
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to add guest');
        }
    };


    return (
        <div className="w-full max-w-lg px-8 pt-4 pb-10">
            <form onSubmit={handleSubmit} className="animate-in flex flex-col justify-center gap-4 bg-white shadow-lg rounded-lg p-6">
                <div className="mb-4">
                    <label className="text-md font-medium block mb-2" htmlFor="firstName">First Name:</label>
                    <input
                        className="rounded-md px-4 py-2 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="text-md font-medium block mb-2" htmlFor="lastName">Last Name:</label>
                    <input
                        className="rounded-md px-4 py-2 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="text-md font-medium block mb-2" htmlFor="cabin">Cabin:</label>
                    <input
                        className="rounded-md px-4 py-2 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                        type="text"
                        id="cabin"
                        name="cabin"
                        value={formData.cabin}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="text-md font-medium block mb-2" htmlFor="age">Age:</label>
                    <input
                        className="rounded-md px-4 py-2 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                        type="number"  // Changed to 'number' to enhance input appropriateness
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="bg-green-700 hover:bg-green-800 rounded-md px-4 py-2 text-white transition-colors">
                    Submit
                </button>
            </form>
        </div>
    );
    
};

export default SubmitUser;
