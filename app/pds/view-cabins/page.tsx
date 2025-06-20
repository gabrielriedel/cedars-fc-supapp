'use client'
import React, { useState, useEffect } from 'react';
import Link from "next/link";

interface Camper {
  first_name: string;
  last_name: string;
}

const CabinRosterView: React.FC = () => {
  const [session, setSession] = useState('');
  const [year, setYear] = useState('');
  const [program, setProgram] = useState('');
  const [cabins, setCabins] = useState<Record<string, Camper[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - 1 + i);

  useEffect(() => {
    const fetchCabinData = async () => {
      if (!session || !year || !program) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/pds/GetCabins?session=${session}&year=${year}&program=${program}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to fetch data');
        }
        const data = await res.json();
        setCabins(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setCabins({});
      } finally {
        setLoading(false);
      }
    };

    fetchCabinData();
  }, [session, year, program]);

  return (
    <div className="w-full flex flex-col items-center p-6">
        <Link
                    href="/pds/main_dash"
                    className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center text-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to main camp dashboard
                </Link>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl mb-6">
        <h1 className="text-xl font-bold mb-4 text-center text-green-800">Cabin Roster Viewer</h1>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year:</label>
            <select
              className="w-full border border-gray-300 text-black rounded-md px-3 py-1"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session:</label>
            <select
              className="w-full border border-gray-300 text-black rounded-md px-3 py-1"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            >
              <option value="">Select Session</option>
              {[1, 2, 3, 4].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program:</label>
            <select
              className="w-full border border-gray-300 text-black rounded-md px-3 py-1"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            >
              <option value="">Select Program</option>
              <option value="Ark">Ark</option>
              <option value="Nest">Nest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        {loading && <p className="text-center text-gray-500">Loading roster...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && Object.keys(cabins).length > 0 && (
          <div className="space-y-4">
            {Object.entries(cabins).map(([cabinName, campers]) => (
              <div key={cabinName} className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold text-green-700 mb-2">{cabinName}</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {campers.map((c, index) => (
                    <li key={index}>{c.first_name} {c.last_name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && session && year && program && Object.keys(cabins).length === 0 && (
          <p className="text-center text-gray-500">No campers found for this combination.</p>
        )}
      </div>
    </div>
  );
};

export default CabinRosterView;
