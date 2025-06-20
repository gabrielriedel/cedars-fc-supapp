'use client'
import React, { useState, useEffect } from 'react';

const ActivityScheduleView: React.FC = () => {
  const [year, setYear] = useState('');
  const [session, setSession] = useState('');
  const [day, setDay] = useState('');
  const [program, setProgram] = useState('');
  const [schedule, setSchedule] = useState<Record<string, Record<string, string[]>>>({});
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => `${currentYear - 1 + i}`);
  const sessionOptions = ['1', '2', '3', '4'];
  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const programOptions = ['Ark', 'Nest'];
  const hours = ['1', '2', '3', '4', '5'];

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-800">Daily Activity Schedule</h1>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <select value={year} onChange={e => setYear(e.target.value)} className="border text-black rounded px-3 py-1">
          <option value="">Select Year</option>
          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select value={session} onChange={e => setSession(e.target.value)} className="border text-black rounded px-3 py-1">
          <option value="">Select Session</option>
          {sessionOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={day} onChange={e => setDay(e.target.value)} className="border text-black rounded px-3 py-1">
          <option value="">Select Day</option>
          {dayOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={program} onChange={e => setProgram(e.target.value)} className="border text-black rounded px-3 py-1">
          <option value="">Select Program</option>
          {programOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Schedule Table */}
      {loading ? (
        <p className="text-gray-600">Loading schedule...</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {hours.map(hour => (
              <div key={hour} className="border text-black rounded-lg p-4 bg-white shadow-sm min-w-[200px]">
                <h2 className="text-lg font-bold text-center mb-3">Hour {hour}</h2>

                {schedule[hour] ? (
                  Object.entries(schedule[hour]).map(([activity, campers]) => (
                    <div key={activity} className="mb-4">
                      <p className="font-semibold text-green-700">{activity}</p>
                      <ul className="ml-2 mt-1 list-disc text-sm text-gray-800">
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
