'use client'
import React, { useState } from 'react';
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

const AllSchedules: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [schedules, setSchedules] = useState<GuestSchedule[]>([]);
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
            const response = await fetch('/api/scheduleView', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ day: selectedDay }),
            });

            if (!response.ok) throw new Error('Failed to fetch schedules');
            
            const data = await response.json();
            const groupedSchedules = data.reduce((acc: GuestSchedule[], curr: any) => {
                const guest = acc.find(g => g.guest_id === curr.guest_id);
                const activity: Activity = {
                    hour: curr.hour,
                    activity_name: curr.activity_name,
                    location: curr.location,
                    attire: curr.attire,
                };

                if (guest) {
                    guest.activities.push(activity);
                } else {
                    acc.push({
                        guest_id: curr.guest_id,
                        first_name: curr.first_name,
                        last_name: curr.last_name,
                        activities: [activity],
                    });
                }
                return acc;
            }, []);

            setSchedules(groupedSchedules);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setSchedules([]);
        }
        setLoading(false);
    };

    const generatePDF = () => {
        const input = document.getElementById('schedules');
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

                pdf.save(`schedules_${selectedDay}.pdf`);
            });
        }
    };

    return (
        <div className="w-full">
            <div className="mt-10 w-full">
                <div className="flex justify-center">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold py-2 px-8 bg-green-500 text-white rounded-full">
                        View All Activity Schedules!
                    </h1>
                </div>
                <div className="flex justify-start mt-4">
                    <div className="flex flex-col space-y-2 w-full max-w-md px-8">
                        <label htmlFor="daySelect" className="block text-black font-medium py-2">
                            Choose a day of the week:
                        </label>
                        <select id="daySelect" name="days" onChange={handleDaySelection} className="mt-1 block w-full pl-3 pr-10 py-2 text-white bg-green-500 hover:bg-green-700 focus:bg-green-600 border-none focus:outline-none focus:ring-2 focus:ring-green-700 rounded-md">
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
                    <button onClick={handleSubmit} className="py-2 px-8 bg-green-500 text-white hover:bg-green-700 focus:bg-green-600 rounded-full">
                        Submit
                    </button>
                </div>
                {titleVisible && selectedDay && (
                    <div className="flex justify-center mt-6 items-center space-x-4">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold border-b-2 border-green-500 pb-2">
                            Schedules for {selectedDay}
                        </h2>
                        <button onClick={generatePDF} className="py-2 px-8 bg-green-500 text-white hover:bg-green-700 focus:bg-green-600 rounded-full">
                            Download PDF
                        </button>
                    </div>
                )}
                {loading ? (
                    <div className="flex justify-center mt-4">Loading schedules...</div>
                ) : (
                    schedules.length > 0 && (
                        <div>
                            <div id="schedules" className="mt-8 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                                {schedules.slice(0, 6).map((schedule, index) => (
                                    <div key={index} className="mb-8 border border-green-500 p-2 rounded-md text-xs">
                                        <h3 className="text-sm font-bold mb-2 border-b border-green-500 pb-1">
                                            {schedule.first_name} {schedule.last_name}
                                        </h3>
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
                                                {schedule.activities.slice(0, 5).map((activity, idx) => (
                                                    <tr key={idx} className="even:bg-green-100">
                                                        <td className="py-1 px-2 border-b border-green-500">{activity.hour}</td>
                                                        <td className="py-1 px-2 border-b border-green-500">{activity.activity_name}</td>
                                                        <td className="py-1 px-2 border-b border-green-500">{activity.location}</td>
                                                        <td className="py-1 px-2 border-b border-green-500">{activity.attire}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AllSchedules;
