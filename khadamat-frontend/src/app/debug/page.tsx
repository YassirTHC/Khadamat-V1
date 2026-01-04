// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { proApi } from '@/lib/api-client';

export default function DebugPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);

  const callApi = async () => {
    setLoading(true);
    setError(null);
    setData([]);
    try {
      const res = await proApi.search({});
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callApi();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">Debug API Connectivity</h1>

      {loading && <p>Chargement...</p>}

      {!loading && !error && data.length >= 0 && (
        <div>
          <p>✅ SUCCÈS : {data.length} Pros trouvés</p>
          {data.length > 0 && (
            <pre className="bg-gray-100 p-2 mt-2 rounded">
              {JSON.stringify(data.slice(0, 2), null, 2)}
            </pre>
          )}
        </div>
      )}

      {!loading && error && (
        <div className="border border-red-500 p-4 rounded">
          <p>❌ ERREUR : {error.message || 'Unknown error'}</p>
          <pre className="bg-gray-100 p-2 mt-2 rounded">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      <button
        onClick={callApi}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  );
}
