'use client'
import React, { useState } from 'react';

interface FormData {
  activityName: string;
  hour: string;
  day: string;
}

interface StickyData {
  session: string;
  year: string;
  program: string;
}

const MainActivityCreate: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ activityName: '', hour: '', day: '' });
  const [stickyData, setStickyData] = useState<StickyData>({ session: '', year: '', program: ''});

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "session" || name === "year" || name == "program") {
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

    if (!combinedData.activityName || !combinedData.hour || !combinedData.day || !combinedData.session || !combinedData.year || !combinedData.program) {
      alert('All fields are required!');
      return;
    }

    try {
      const response = await fetch('/api/admin/createMainAct', {
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
      setFormData({ activityName: '', hour: '', day: '' });
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
          <label className="text-sm font-medium text-black block mb-1" htmlFor="activityName">Activity Name:</label>
          <input
            className="rounded-md px-3 py-1 bg-gray-50 text-black border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
            type="text"
            id="activityName"
            name="activityName"
            value={formData.activityName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label className="text-sm font-medium text-black block mb-1" htmlFor="hour">Hour:</label>
          <select
            className="rounded-md px-3 py-1 bg-gray-50 text-black border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
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
          <label className="text-sm font-medium text-black block mb-1" htmlFor="day">Day:</label>
          <select
            className="rounded-md px-3 py-1 bg-gray-50 text-black border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 w-full"
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

        <button type="submit" className="bg-green-700 hover:bg-green-800 rounded-md px-4 py-2 text-white transition-colors w-full">
          Submit
        </button>
      </form>
    </div>
  );
};

export default MainActivityCreate;
