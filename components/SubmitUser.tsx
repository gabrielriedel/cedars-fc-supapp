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
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="cabin">Cabin:</label>
                <input
                    type="text"
                    id="cabin"
                    name="cabin"
                    value={formData.cabin}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="age">Age:</label>
                <input
                    type="text"  // Using text input to simplify age handling
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default SubmitUser;
