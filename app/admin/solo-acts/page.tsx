'use client'
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Activity {
    hour: string;
    activity_name: string;
    location: string;
    attire: string;
}

interface GuestSchedule {
    guest_id: number;
    first_name: string;
    last_name: string;
    activities: Activity[];
}

interface Guest {
    guest_id: number;
    first_name: string;
    last_name: string;
}

const AllSchedules: React.FC = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [selectedGuest, setSelectedGuest] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [schedule, setSchedule] = useState<Activity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const response = await fetch('/api/guests');
                if (!response.ok) throw new Error('Failed to fetch guests');
                const data = await response.json();
                setGuests(data);
            } catch (error) {
                console.error('Error fetching guests:', error);
            }
        };

        fetchGuests();
    }, []);

    const handleGuestSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGuest(Number(event.target.value));
    };

    const handleDaySelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(event.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedGuest || !selectedDay) {
            alert('Please select a guest and a day.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/solo-sched', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ guest_id: selectedGuest, day: selectedDay }),
            });

            if (!response.ok) throw new Error('Failed to fetch schedule');
            
            const data = await response.json();
            setSchedule(data.activities);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            setSchedule([]);
        }
        setLoading(false);
    };

    const generatePDF = () => {
        const input = document.getElementById('schedule');
        if (input) {
            html2canvas(input, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210; // Full width of A4 page
                const pageHeight = 295;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                const margin = 10;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth - margin * 2, imgHeight);
                heightLeft -= pageHeight - margin * 2;

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth - margin * 2, imgHeight);
                    heightLeft -= pageHeight - margin * 2;
                }

                pdf.save(`schedule_${selectedGuest}_${selectedDay}.pdf`);
            });
        }
    };

    return (
        <div className="w-full">
            <div className="mt-10 w-full">
                <div className="flex justify-center">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold py-2 px-8 bg-green-500 text-white rounded-full">
                        View Individual Activity Schedule!
                    </h1>
                </div>
                <div className="flex justify-start mt-4">
                    <div className="flex flex-col space-y-2 w-full max-w-md px-8">
                        <label htmlFor="guestSelect" className="block text-black font-medium py-2">
                            Choose a guest:
                        </label>
                        <select id="guestSelect" name="guests" onChange={handleGuestSelection} className="mt-1 block w-full pl-3 pr-10 py-2 text-white bg-green-500 hover:bg-green-700 focus:bg-green-600 border-none focus:outline-none focus:ring-2 focus:ring-green-700 rounded-md">
                            <option value="">Select a guest</option>
                            {guests.map((guest) => (
                                <option key={guest.guest_id} value={guest.guest_id} className="bg-white text-black">
                                    {guest.first_name} {guest.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-start mt-4">
                    <div className="flex flex-col space-y-2 w-full max-w-md px-8">
                        <label htmlFor="daySelect" className="block text-black font-medium py-2">
                            Choose a day of the week:
                        </label>
                        <select id="daySelect" name="days" onChange={handleDaySelection} className="mt-1 block w-full pl-3 pr-10 py-2 text-white bg-green-500 hover:bg-green-700 focus:bg-green-600 border-none focus:outline-none focus:ring-2 focus:ring-green-700 rounded-md">
                            <option value="">Select a day</option>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                                <option key={index} value={day} className="bg-white text-black">
                                    {day}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    <button onClick={handleSubmit} className="py-2 px-8 bg-green-500 text-white hover:bg-green-700 focus:bg-green-600 rounded-full">
                        Submit
                    </button>
                </div>
                {loading ? (
                    <div className="flex justify-center mt-4">Loading schedule...</div>
                ) : (
                    schedule.length > 0 && (
                        <div id="schedule" className="mt-8 w-full max-w-6xl mx-auto">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold border-b-2 border-green-500 pb-2">
                                Schedule for {guests.find(guest => guest.guest_id === selectedGuest)?.first_name} {guests.find(guest => guest.guest_id === selectedGuest)?.last_name} on {selectedDay}
                            </h2>
                            <table className="min-w-full bg-white border border-green-500">
                                <thead className="bg-green-500 text-white">
                                    <tr>
                                        <th className="py-1 px-2 border-b border-green-500">Hour</th>
                                        <th className="py-1 px-2 border-b border-green-500">Activity</th>
                                        <th className="py-1 px-2 border-b border-green-500">Location</th>
                                        <th className="py-1 px-2 border-b border-green-500">Attire</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedule.map((activity, index) => (
                                        <tr key={index} className="even:bg-green-100">
                                            <td className="py-1 px-2 border-b border-green-500">{activity.hour}</td>
                                            <td className="py-1 px-2 border-b border-green-500">{activity.activity_name}</td>
                                            <td className="py-1 px-2 border-b border-green-500">{activity.location}</td>
                                            <td className="py-1 px-2 border-b border-green-500">{activity.attire}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-center mt-6">
                                <button onClick={generatePDF} className="py-2 px-8 bg-green-500 text-white hover:bg-green-700 focus:bg-green-600 rounded-full">
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AllSchedules;
