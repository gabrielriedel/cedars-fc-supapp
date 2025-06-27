'use client';
import React, { useEffect, useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const hours = ['1', '2', '3', '4'];
const programs = ['Ark', 'Nest'];
const sessionOptions = ['1', '2', '3', '4'];

export default function ActivitiesGridPage() {
  const currentYear = new Date().getFullYear().toString();
  const yearOptions = Array.from({ length: 10 }, (_, i) => `${+currentYear - 1 + i}`);

  const [year, setYear] = useState(currentYear);
  const [session, setSession] = useState('1');
  const [program, setProgram] = useState('Ark');
  const [schedule, setSchedule] = useState<Record<string, Record<string, string[]>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!year || !session || !program) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/pds/activitiesByTime?year=${year}&session=${session}&program=${program}`);
        const data = await res.json();
        setSchedule(data || {});
      } catch (err) {
        console.error('Error fetching schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, session, program]);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Activities Offered by Time
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <select value={year} onChange={e => setYear(e.target.value)} className="border text-black rounded px-3 py-2">
          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={session} onChange={e => setSession(e.target.value)} className="border text-black rounded px-3 py-2">
          {sessionOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={program} onChange={e => setProgram(e.target.value)} className="border text-black rounded px-3 py-2">
          {programs.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading activities...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {days.map(day => (
            <div key={day} className="border p-4 rounded shadow-sm bg-gray-50">
              <h2 className="text-xl font-semibold text-green-800 mb-4 text-center">{day}</h2>
              {hours.map(hour => (
                <div key={hour} className="mb-3">
                  <h3 className="text-sm font-bold text-gray-700 mb-1">Hour {hour}</h3>
                  <ul className="list-disc list-inside text-sm text-gray-800">
                    {schedule[day]?.[hour]?.length ? (
                      schedule[day][hour].map((activity, idx) => (
                        <li key={idx}>{activity}</li>
                      ))
                    ) : (
                      <li className="italic text-gray-400">No activities</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
