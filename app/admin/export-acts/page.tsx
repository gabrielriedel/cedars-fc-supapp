'use client'
import { useState } from 'react';

const ExportData = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/sheets-acts', {
        method: 'POST',
      });

      if (response.ok) {
        setMessage('Data exported successfully!');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Export Data to Google Sheets</h1>
      <button onClick={handleExport} disabled={loading}>
        {loading ? 'Exporting...' : 'Export Data'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ExportData;
