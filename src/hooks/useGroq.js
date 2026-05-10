import { useState } from 'react';

export function useGroq() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function parseVoice(transcript) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/parse-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.action;
    } catch (err) {
      setError(err.message);
      return { type: 'unknown' };
    } finally {
      setLoading(false);
    }
  }

  return { parseVoice, loading, error };
}