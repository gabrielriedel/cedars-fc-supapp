'use client';
import React, { useEffect, useState } from 'react';

type ActivityChoice = { first: string };

type Camper = {
  first: string;
  last: string;
  cabin: string;
  choices: {
    [day: string]: {
      [hour: string]: ActivityChoice;
    };
  };
};

const days = ['Tuesday', 'Wednesday', 'Thursday'];
const hours = ['1', '2', '3', '4'];
const programs = ['Ark', 'Nest', 'BLP'];

const CamperChoiceSchedule: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => `${currentYear - 1 + i}`);
  const sessionOptions = ['1', '2', '3', '4'];

  const [year, setYear] = useState<string>(currentYear.toString());
  const [session, setSession] = useState<string>('1');
  const [program, setProgram] = useState<string>('BLP');
  const [campers, setCampers] = useState<Camper[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!year || !session || !program) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/pds/cabinActivityChoices?year=${year}&session=${session}&program=${program}`);
        const data = await res.json();
        setCampers(data || []);
      } catch (err) {
        console.error('Error loading camper choices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, session, program]);

  const campersByCabin = campers.reduce<Record<string, Camper[]>>((acc, camper) => {
    acc[camper.cabin] = acc[camper.cabin] || [];
    acc[camper.cabin].push(camper);
    return acc;
  }, {});

  return (
    <div className="bg-white text-black min-h-screen py-10 px-6 sm:px-12">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-10">
        Camper First-Choice Activity Grid
      </h1>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 justify-center mb-12 print:hidden">
        <select value={year} onChange={e => setYear(e.target.value)} className="border border-gray-300 rounded px-4 py-2 bg-white shadow-sm focus:ring-green-300 focus:outline-none">
          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={session} onChange={e => setSession(e.target.value)} className="border border-gray-300 rounded px-4 py-2 bg-white shadow-sm focus:ring-green-300 focus:outline-none">
          {sessionOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={program} onChange={e => setProgram(e.target.value)} className="border border-gray-300 rounded px-4 py-2 bg-white shadow-sm focus:ring-green-300 focus:outline-none">
          {programs.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading schedule...</p>
      ) : (
        Object.entries(campersByCabin).map(([cabin, camperList]) => (
          <div key={cabin} className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-4">
              {cabin}
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-green-50 text-green-900">
                  <tr>
                    <th className="px-4 py-3 border border-gray-300 font-semibold">First</th>
                    <th className="px-4 py-3 border border-gray-300 font-semibold">Last</th>
                    {days.map(day =>
                      hours.map(hour => (
                        <th key={`${day}-${hour}`} className="px-4 py-3 border border-gray-300 font-semibold text-center">
                          {day} {hour}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {camperList.map((camper, index) => (
                    <tr key={`${camper.first}-${camper.last}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 border border-gray-300">{camper.first}</td>
                      <td className="px-4 py-2 border border-gray-300">{camper.last}</td>
                      {days.map(day =>
                        hours.map(hour => (
                          <td
                            key={`${camper.first}-${day}-${hour}`}
                            className="px-3 py-2 border border-gray-300 text-center text-gray-700"
                          >
                            {camper.choices?.[day]?.[hour]?.first || ''}
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CamperChoiceSchedule;
