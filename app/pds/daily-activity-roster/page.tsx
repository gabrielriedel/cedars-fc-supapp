'use client';
import React, { useEffect, useState } from 'react';

type ActivityChoice = {
  first: string;
};

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
        const res = await fetch(`/api/pds/camperActivityChoices?year=${year}&session=${session}&program=${program}`);
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
    <div className="bg-white text-black min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
        Camper First-Choice Activity Grid
      </h1>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 justify-center mb-10 print:hidden">
        <select
          value={year}
          onChange={e => setYear(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 bg-white shadow-sm"
        >
          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select
          value={session}
          onChange={e => setSession(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 bg-white shadow-sm"
        >
          {sessionOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={program}
          onChange={e => setProgram(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 bg-white shadow-sm"
        >
          {programs.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading schedule...</p>
      ) : (
        Object.entries(campersByCabin).map(([cabin, camperList]) => (
          <div key={cabin} className="mb-12">
            <h2 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-1">{cabin}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 border-collapse">
                <thead className="bg-gray-100 text-sm">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2">First</th>
                    <th className="border border-gray-300 px-3 py-2">Last</th>
                    {days.map(day =>
                      hours.map(hour => (
                        <th key={`${day}-${hour}`} className="border border-gray-300 px-3 py-2">
                          {day} {hour}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {camperList.map(camper => (
                    <tr key={`${camper.first}-${camper.last}`} className="even:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2">{camper.first}</td>
                      <td className="border border-gray-300 px-3 py-2">{camper.last}</td>
                      {days.map(day =>
                        hours.map(hour => (
                          <td
                            key={`${camper.first}-${day}-${hour}`}
                            className="border border-gray-300 px-3 py-2 text-center"
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
