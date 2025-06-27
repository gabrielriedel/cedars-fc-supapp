'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";

const ActivityScheduleView: React.FC = () => {
  const [year, setYear] = useState('');
  const [session, setSession] = useState('');
  const [day, setDay] = useState('');
  const [program, setProgram] = useState('');
  const [schedule, setSchedule] = useState<Record<string, Record<string, string[]>>>({});
  const [loading, setLoading] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => `${currentYear - 1 + i}`);
  const sessionOptions = ['1', '2', '3', '4'];
  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const programOptions = ['Ark', 'Nest'];
  const hours = ['1', '2', '3', '4']; // Removed hour 5

  const fetchSchedule = async () => {
    if (!year || !session || !day || !program) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/pds/dailyActivitySchedule?year=${year}&session=${session}&day=${day}&program=${program}`);
      const data = await res.json();
      setSchedule(data || {});
    } catch (err) {
      console.error('Error loading schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [year, session, day, program]);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '', 'width=900,height=650');
    win!.document.write(`
      <html>
        <head>
          <title>Schedule for ${day} (${program})</title>
          <style>
            body {
              font-family: sans-serif;
              padding: 20px;
              background: white;
              color: black;
            }
            h2 {
              text-align: center;
              color: #1f2937;
              margin-bottom: 30px;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
            }
            .card {
              border: 2px solid #000;
              border-radius: 8px;
              padding: 16px;
              background: #f9fafb;
            }
            .card h3 {
              text-align: center;
              margin-bottom: 16px;
              font-size: 1.25rem;
              color: #1f2937;
            }
            .activity {
              border: 1px solid #666;
              border-radius: 6px;
              padding: 10px;
              background: white;
              margin-bottom: 14px;
            }
            .activity h4 {
              margin: 0 0 6px;
              font-size: 1rem;
              color: #047857;
            }
            .activity ul {
              margin-left: 1em;
              padding-left: 0;
              list-style: disc;
              font-size: 0.9rem;
              color: #333;
            }
          </style>
        </head>
        <body>
          <h2>${day} Activity Schedule – ${program}</h2>
          <div class="grid">
            ${hours.map(hour => {
              const activities = schedule[hour];
              return `
                <div class="card">
                  <h3>Hour ${hour}</h3>
                  ${
                    activities
                      ? Object.entries(activities)
                          .map(([activity, campers]) => `
                            <div class="activity">
                              <h4>${activity} – ${campers.length}</h4>
                              <ul>${campers.map(name => `<li>${name}</li>`).join('')}</ul>
                            </div>
                          `).join('')
                      : `<p style="text-align:center; font-style:italic; color:gray;">No activities</p>`
                  }
                </div>
              `;
            }).join('')}
          </div>
        </body>
      </html>
    `);
    win!.document.close();
    win!.focus();
    win!.print();
    win!.close();
  };

  return (
    <div className="bg-white text-black min-h-screen py-10 px-4 sm:px-8 lg:px-16">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Link
          href="/pds/main_dash"
          className="py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 text-sm shadow"
        >
          ← Back to Dashboard
        </Link>
        <button
          onClick={handlePrint}
          className="py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm shadow"
          disabled={!day || !program}
        >
          Print Schedule
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
        Daily Activity Schedule
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 print:hidden">
        <select value={year} onChange={e => setYear(e.target.value)} className="border border-gray-300 shadow-sm bg-white text-black rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-200">
          <option value="">Select Year</option>
          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={session} onChange={e => setSession(e.target.value)} className="border border-gray-300 shadow-sm bg-white text-black rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-200">
          <option value="">Select Session</option>
          {sessionOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={day} onChange={e => setDay(e.target.value)} className="border border-gray-300 shadow-sm bg-white text-black rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-200">
          <option value="">Select Day</option>
          {dayOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={program} onChange={e => setProgram(e.target.value)} className="border border-gray-300 shadow-sm bg-white text-black rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-200">
          <option value="">Select Program</option>
          {programOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Schedule Display */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading schedule...</p>
      ) : (
        <div ref={printRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {hours.map(hour => (
              <div key={hour} className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow">
                <h2 className="text-lg font-semibold text-center mb-3 text-gray-800">Hour {hour}</h2>
                {schedule[hour] ? (
                  Object.entries(schedule[hour]).map(([activity, campers]) => (
                    <div
                      key={activity}
                      className="mb-4 border border-gray-300 rounded-md bg-white p-3 shadow-sm print:shadow-none print:border-black"
                    >
                      <h3 className="font-semibold text-green-700">
                        {activity} – {campers.length}
                      </h3>
                      <ul className="ml-4 mt-1 list-disc text-sm text-gray-700">
                        {campers.map((name, index) => (
                          <li key={index}>{name}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center text-gray-400 italic">No activities</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityScheduleView;
