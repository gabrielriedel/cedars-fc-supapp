// app/assign-main-activities/page.tsx
'use client'
import React, { useState, useEffect } from 'react';

interface Camper {
  first_name: string;
  last_name: string;
}

const AssignMainActivities: React.FC = () => {
  const [year, setYear] = useState('');
  const [session, setSession] = useState('');
  const [program, setProgram] = useState('');
  const [cabin, setCabin] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [campers, setCampers] = useState<Camper[]>([]);
  const [selections, setSelections] = useState<Record<string, { first: string; second: string }>>({});
  const [activityOptions, setActivityOptions] = useState<string[]>([]);

  const yearOptions = Array.from({ length: 20 }, (_, i) => `${new Date().getFullYear() - 1 + i}`);
  const sessionOptions = ['1', '2', '3', '4'];
  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const hourOptions = ['1', '2', '3', '4', '5'];

  const stickyComplete = year && session && program && cabin;

  useEffect(() => {
    const fetchCampers = async () => {
      if (!stickyComplete) return;
      const res = await fetch(`/api/counselors/rosterBySession?year=${year}&session=${session}&program=${program}`);
      const data = await res.json();
      setCampers(data[cabin] || []);
      setSelections({});
    };
    fetchCampers();
  }, [year, session, program, cabin]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!stickyComplete || !day || !hour) return;
      const res = await fetch(`/api/counselors/activityOptions?year=${year}&session=${session}&program=${program}&day=${day}&hour=${hour}`);
      const data = await res.json();
      setActivityOptions(data);
      setSelections({});
    };
    fetchActivities();
  }, [day, hour]);

  const handleSelect = (camperKey: string, type: 'first' | 'second', value: string) => {
    setSelections(prev => ({
      ...prev,
      [camperKey]: { ...prev[camperKey], [type]: value },
    }));
  };

  const handleSubmit = async () => {
  if (!year || !session || !program || !cabin || !day || !hour) {
    alert('All fields must be filled.');
    return;
  }

  const entries = campers.flatMap(c => {
    const key = `${c.first_name}_${c.last_name}`;
    const selection = selections[key];
    if (!selection) return [];

    return [
      {
        first_name: c.first_name,
        last_name: c.last_name,
        cabin,
        activity_name: selection.first,
        session,
        year,
        day,
        hour,
        program, 
        choice_type: 'first'
      },
      {
        first_name: c.first_name,
        last_name: c.last_name,
        cabin,
        activity_name: selection.second,
        session,
        year,
        day,
        hour,
        program, 
        choice_type: 'second'
      }
    ];
  });

  try {
    const res = await fetch('/api/counselors/mainActivitiesRoster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entries)
    });

    if (!res.ok) throw new Error('Failed to save choices');

    alert('Activities saved successfully!');
  } catch (err) {
    alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-black mb-6 text-green-700">Assign Main Activities</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select value={year} onChange={e => setYear(e.target.value)} className="border text-black rounded px-3 py-1">
          <option value="">Select Year</option>
          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select value={session} onChange={e => setSession(e.target.value)} className="border text-black rounded px-3 py-1">
          <option value="">Select Session</option>
          {sessionOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={program} onChange={e => setProgram(e.target.value)} className="border text-black rounded px-3 py-1">
          <option value="">Select Program</option>
          <option value="Ark">Ark</option>
          <option value="Nest">Nest</option>
        </select>

        <select value={cabin} onChange={e => setCabin(e.target.value)} className="border text-black rounded px-3 py-1">
          <option value="">Select Cabin</option>
            <option value="Whippoorwhills">Whippoorwhills</option>
            <option value="Bobolinks">Bobolinks</option>
            <option value="Cardinals">Cardinals</option>
            <option value="Towhees">Towhees</option>
            <option value="Owls">Owls</option>
            <option value="Meadowlarks">Meadowlarks</option>
            <option value="Doves">Doves</option>
            <option value="Blue Herons">Blue Herons</option>
            <option value="Robins">Robins</option>
            <option value="Bluebirds">Towhees</option>
            <option value="Trailblazers">Trailblazers</option>
            <option value="Range Rieders">Range Rieders</option>
            <option value="Pioneers">Pioneers</option>
            <option value="Explorers">Explorers</option>
            <option value="Uplifters">Uplifters</option>
            <option value="Lyons Den">Lyons Den</option>
            <option value="Lamplighters">Lamplighters</option>
            <option value="Warriors">Warriors</option>
            <option value="Pathfinders">Pathfinders</option>
            <option value="Big G">Big G</option>
          </select>

        <select value={day} onChange={e => setDay(e.target.value)} className="border text-black rounded px-3 py-1">
          <option value="">Select Day</option>
          {dayOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={hour} onChange={e => setHour(e.target.value)} className="border text-black rounded px-3 py-1">
          <option value="">Select Hour</option>
          {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      {campers.length > 0 && activityOptions.length > 0 && (
        <div className="space-y-4">
          {campers.map((c, idx) => {
            const key = `${c.first_name}_${c.last_name}`;
            return (
              <div key={key} className="bg-gray-50 p-4 text-black rounded shadow">
                <p className="font-semibold mb-2">{c.first_name} {c.last_name}</p>
                <div className="grid grid-cols-2 gap-2">
                  <select value={selections[key]?.first || ''} onChange={e => handleSelect(key, 'first', e.target.value)} className="border rounded px-2 py-1">
                    <option value="">First Choice</option>
                    {activityOptions.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>

                  <select value={selections[key]?.second || ''} onChange={e => handleSelect(key, 'second', e.target.value)} className="border rounded px-2 py-1">
                    <option value="">Second Choice</option>
                    {activityOptions.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="mt-6 bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
      >
        Submit
      </button>
    </div>
  );
};

export default AssignMainActivities;
