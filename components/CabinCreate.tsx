'use client'
import React, { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
}

interface StickyData {
  session: string;
  year: string;
  program: string;
  cabin: string;
}

const CabinCreate: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ firstName: '', lastName: ''});
  const [stickyData, setStickyData] = useState<StickyData>({ session: '', year: '', program: '', cabin: ''});

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "session" || name === "year" || name == "program" || name == "cabin") {
      setStickyData({ ...stickyData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const combinedData = {
      ...formData,
      ...stickyData,
    };

    if (!combinedData.firstName || !combinedData.lastName || !combinedData.session || !combinedData.year || !combinedData.program || !combinedData.cabin)  {
      alert('All fields are required!');
      return;
    }

    try {
      const response = await fetch('/api/familyCamp/createCabin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(combinedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create activity');
      }

      const result = await response.json();
      alert('Activity added successfully!');
      console.log(result);

      // Clear only part of the form
      setFormData({ firstName: '', lastName: ''});
      // stickyData (year/session) is retained

    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create activity');
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - 1 + i); // 5 years back, 15 ahead


  return (
    <div className="w-full h-full flex justify-center items-center">
      <form onSubmit={handleSubmit} className="animate-in flex flex-col justify-center gap-2 bg-white shadow-lg rounded-lg p-4 w-full max-w-lg">

        <div className="mb-2">
        <label className="text-sm font-medium text-black block mb-1" htmlFor="year">Year:</label>
        <select
            className="rounded-md px-3 py-1 bg-gray-50 text-black border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
            id="year"
            name="year"
            value={stickyData.year}
            onChange={handleChange}
            required
        >
            <option value="">Select Year</option>
            {yearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
            ))}
        </select>
        </div>

        <div className="mb-2">
          <label className="text-sm font-medium text-black block mb-1" htmlFor="session">Session:</label>
          <select
            className="rounded-md px-3 py-1 bg-gray-50 text-black border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
            id="session"
            name="session"
            value={stickyData.session}
            onChange={handleChange}
            required
          >
            <option value="">Select Session</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="text-sm font-medium text-black block mb-1" htmlFor="program">Program:</label>
          <select
            className="rounded-md px-3 py-1 bg-gray-50 text-black border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
            id="program"
            name="program"
            value={stickyData.program}
            onChange={handleChange}
            required
          >
            <option value="">Select Program</option>
            <option value="Nest">Nest</option>
            <option value="Ark">Ark</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="text-sm font-medium text-black block mb-1" htmlFor="cabin">Cabin:</label>
          <select
            className="rounded-md px-3 py-1 bg-gray-50 text-black border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
            id="cabin"
            name="cabin"
            value={stickyData.cabin}
            onChange={handleChange}
            required
          >
            <option value="">Select Cabin</option>
            <option value="Whippoorwhills">Whippoorwhills</option>
            <option value="Bobolinks">Bobolinks</option>
            <option value="Cardinals">Cardinals</option>
            <option value="Towhees">Towhees</option>
            <option value="Owls">Owls</option>
            <option value="Meadowlarks">Meadowlarks</option>
            <option value="Doves">Doves</option>
            <option value="Blue Herons">Blue Herons</option>
            <option value="Robins">Robins</option>
            <option value="Bluebirds">Towhees</option>
            <option value="Trailblazers">Trailblazers</option>
            <option value="Range Rieders">Range Rieders</option>
            <option value="Pioneers">Pioneers</option>
            <option value="Explorers">Explorers</option>
            <option value="Uplifters">Uplifters</option>
            <option value="Lyons Den">Lyons Den</option>
            <option value="Lamplighters">Lamplighters</option>
            <option value="Warriors">Warriors</option>
            <option value="Pathfinders">Pathfinders</option>
            <option value="Big G">Big G</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="text-sm font-medium text-black block mb-1" htmlFor="firstName">First Name:</label>
          <input
            className="rounded-md px-3 py-1 bg-gray-50 text-black border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label className="text-sm font-medium text-black block mb-1" htmlFor="lastName">Last Name:</label>
          <input
            className="rounded-md px-3 py-1 bg-gray-50 text-black border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="bg-green-700 hover:bg-green-800 rounded-md px-4 py-2 text-white transition-colors w-full">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CabinCreate;
