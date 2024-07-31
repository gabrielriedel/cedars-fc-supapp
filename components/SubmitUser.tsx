// /components/SubmitUser.tsx
'use client'
import React, { useState } from 'react';
import Link from "next/link";

interface UserFormData {
    firstName: string;
    lastName: string;
    cabin: string;
    grade: string;
}

const SubmitUser: React.FC = () => {
    const [formData, setFormData] = useState<UserFormData>({ firstName: '', lastName: '', cabin: '', grade: '' });

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
        if (!formData.firstName || !formData.lastName || !formData.cabin || !formData.grade) {
            alert('All fields are required!');
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
                    grade: formData.grade
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit guest data');
            }

            const result = await response.json();
            alert('Guest added successfully!');
            console.log(result);  // Log or handle response data as needed
            setFormData({ firstName: '', lastName: '', cabin: '', grade: '' });  // Clear the form
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
                    <label className="text-md font-medium block mb-2" htmlFor="grade">Grade:</label>
                    <select
                        className="rounded-md px-4 py-2 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select grade</option>
                        <option value="Infant">Infant</option>
                        <option value="Toddler">Toddler</option>
                        <option value="Pre-K">Pre-K</option>
                        <option value="Kindergarten">Kindergarten</option>
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
                <button type="submit" className="bg-green-700 hover:bg-green-800 rounded-md px-4 py-2 text-white transition-colors">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default SubmitUser;
