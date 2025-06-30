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
    <div className="bg-white text-black min-h-screen py-6 px-4 sm:px-8">
      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0.5in;
          }

          html, body {
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            font-size: 10px;
          }

          .print\\:hidden {
            display: none !important;
          }

          .table-wrapper {
            overflow: visible !important;
          }

          table {
            width: 100% !important;
            table-layout: fixed;
            border-collapse: collapse;
            font-size: 10px;
          }

          th, td {
            border: 1px solid #999 !important;
            padding: 2px !important;
            word-wrap: break-word;
            text-align: center;
          }

          thead {
            background-color: #e0f2f1 !important;
            -webkit-print-color-adjust: exact;
          }

          tr {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-green-700">Camper First-Choice Activity Grid</h1>
        <button
          onClick={() => window.print()}
          className="py-2 px-4 bg-blue-600 text-white text-sm rounded shadow hover:bg-blue-700"
        >
          Print Page
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-start mb-10 print:hidden">
        <select value={year} onChange={e => setYear(e.target.value)} className="border border-gray-300 rounded px-3 py-2 bg-white shadow-sm focus:ring-green-300 focus:outline-none">
          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={session} onChange={e => setSession(e.target.value)} className="border border-gray-300 rounded px-3 py-2 bg-white shadow-sm focus:ring-green-300 focus:outline-none">
          {sessionOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={program} onChange={e => setProgram(e.target.value)} className="border border-gray-300 rounded px-3 py-2 bg-white shadow-sm focus:ring-green-300 focus:outline-none">
          {programs.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading schedule...</p>
      ) : (
        Object.entries(campersByCabin).map(([cabin, camperList]) => (
          <div key={cabin} className="mb-12">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-2">
              Cabin: {cabin}
            </h2>
            <div className="table-wrapper overflow-x-auto rounded-lg border border-gray-200">
              <table>
                <thead>
                  <tr>
                    <th>First</th>
                    <th>Last</th>
                    {days.map(day =>
                      hours.map(hour => (
                        <th key={`${day}-${hour}`}>
                          {day} {hour}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {camperList.map((camper, index) => (
                    <tr key={`${camper.first}-${camper.last}`}>
                      <td>{camper.first}</td>
                      <td>{camper.last}</td>
                      {days.map(day =>
                        hours.map(hour => (
                          <td key={`${camper.first}-${day}-${hour}`}>
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
