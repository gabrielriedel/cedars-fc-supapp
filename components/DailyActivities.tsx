'use client'
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Roster {
    first_name: string;
    last_name: string;
}

interface Activity {
    activity_id: number;
    hour: string;
    activity_name: string;
    capacity: number;
    location: string;
    rosters: Roster[];
}

const DailyActivities: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [titleVisible, setTitleVisible] = useState<boolean>(false);

    const handleDaySelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(event.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedDay) {
            alert('Please select a day.');
            return;
        }

        setLoading(true);
        setTitleVisible(true);

        try {
            const response = await fetch('/api/activitiesView', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ day: selectedDay }),
            });

            if (!response.ok) throw new Error('Failed to fetch activities');
            
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setActivities([]);
        }
        setLoading(false);
    };

    const generatePDF = () => {
        const input = document.getElementById('activities');
        if (input) {
            const hours = input.querySelectorAll('.hour-section');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const margin = 10;
            const imgWidth = 210 - 2 * margin;
            const pageHeight = 295 - 2 * margin;

            hours.forEach((hour, index) => {
                html2canvas(hour as HTMLElement, { scale: 2 }).then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const imgHeight = canvas.height * imgWidth / canvas.width;

                    if (index > 0) {
                        pdf.addPage();
                    }

                    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
                    if (index === hours.length - 1) {
                        pdf.save(`activities_${selectedDay}.pdf`);
                    }
                });
            });
        }
    };

    return (
        <div className="w-full">
            <div className="mt-10 w-full">
                <div className="flex justify-center">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold py-2 px-8 bg-blue-500 text-white rounded-full">
                        View Daily Activities!
                    </h1>
                </div>
                <div className="flex justify-start mt-4">
                    <div className="flex flex-col space-y-2 w-full max-w-md px-8">
                        <label htmlFor="daySelect" className="block text-black font-medium py-2">
                            Choose a day of the week:
                        </label>
                        <select id="daySelect" name="days" onChange={handleDaySelection} className="mt-1 block w-full pl-3 pr-10 py-2 text-white bg-blue-500 hover:bg-blue-700 focus:bg-blue-600 border-none focus:outline-none focus:ring-2 focus:ring-blue-700 rounded-md">
                            <option value="">Select a day</option>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day, index) => (
                                <option key={index} value={day} className="bg-white text-black">
                                    {day}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    <button onClick={handleSubmit} className="py-2 px-8 bg-blue-500 text-white hover:bg-blue-700 focus:bg-blue-600 rounded-full">
                        Submit
                    </button>
                </div>
                {titleVisible && selectedDay && (
                    <div className="flex justify-center mt-6 items-center space-x-4">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold border-b-2 border-blue-500 pb-2">
                            Activities for {selectedDay}
                        </h2>
                        <button onClick={generatePDF} className="py-2 px-8 bg-blue-500 text-white hover:bg-blue-700 focus:bg-blue-600 rounded-full">
                            Download PDF
                        </button>
                    </div>
                )}
                {loading ? (
                    <div className="flex justify-center mt-4">Loading activities...</div>
                ) : (
                    activities.length > 0 && (
                        <div id="activities" className="mt-8 w-full max-w-6xl mx-auto">
                            {activities.reduce((acc, curr) => {
                                const hourIndex = acc.findIndex(hour => hour.hour === curr.hour);
                                if (hourIndex > -1) {
                                    acc[hourIndex].activities.push(curr);
                                } else {
                                    acc.push({ hour: curr.hour, activities: [curr] });
                                }
                                return acc;
                            }, [] as { hour: string, activities: Activity[] }[]).map((hour, index) => (
                                <div key={index} className="hour-section mb-8">
                                    <h3 className="text-lg font-bold mb-2 border-b border-blue-500 pb-1">
                                        {hour.hour}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {hour.activities.map((activity, idx) => (
                                            <div key={idx} className="border border-blue-500 p-2 rounded-md text-xs">
                                                <h4 className="text-sm font-bold mb-1">
                                                    {activity.activity_name} @ {activity.location} - (Age Limit: {activity.capacity})
                                                </h4>
                                                <h5 className="font-medium">Roster:</h5>
                                                <ul>
                                                    {activity.rosters.map((roster, rIdx) => (
                                                        <li key={rIdx}>{roster.first_name} {roster.last_name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default DailyActivities;
