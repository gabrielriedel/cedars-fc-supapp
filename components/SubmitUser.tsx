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
        <form onSubmit={handleSubmit}
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
    <div className="mb-6">
        <label className="text-md block mb-2" htmlFor="firstName">First Name:</label>
        <input
            className="rounded-md px-4 py-2 bg-inherit border"
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
        />
    </div>
    <div className="mb-6">
        <label className="text-md block mb-2" htmlFor="lastName">Last Name:</label>
        <input
            className="rounded-md px-4 py-2 bg-inherit border"
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
        />
    </div>
    <div className="mb-6">
        <label className="text-md block mb-2" htmlFor="cabin">Cabin:</label>
        <input
            className="rounded-md px-4 py-2 bg-inherit border"
            type="text"
            id="cabin"
            name="cabin"
            value={formData.cabin}
            onChange={handleChange}
        />
    </div>
    <div className="mb-6">
        <label className="text-md block mb-2" htmlFor="age">Age:</label>
        <input
            className="rounded-md px-4 py-2 bg-inherit border"
            type="text"  // Consider changing to type="number" if appropriate
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
        />
    </div>
    <button type="submit" className="bg-green-700 rounded-md px-4 py-2 text-white mb-2 hover:bg-green-800 transition-colors">
        Submit
    </button>
</form>

    );
};

export default SubmitUser;
