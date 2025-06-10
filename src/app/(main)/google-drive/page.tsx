"use client";
import { useState, useEffect } from 'react';

interface DriveFile { id: string; name: string; }

export default function GoogleDrivePage() {
  const [resumes, setResumes] = useState<DriveFile[]>([]);
  const [connected, setConnected] = useState(false);

  async function connect() {
    const res = await fetch('/api/google-drive/auth');
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code && !connected) {
      fetch(`/api/google-drive/token?code=${code}`)
        .then(r => r.json())
        .then(async ({ tokens }) => {
          if (tokens) {
            setConnected(true);
            const res = await fetch('/api/google-drive/resumes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tokens })
            });
            const data = await res.json();
            setResumes(data.resumes || []);
          }
        });
    }
  }, [connected]);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-semibold text-text-primary">Google Drive Resumes</h1>
      {!connected && (
        <button onClick={connect} className="bg-blue-500 text-white px-4 py-2 rounded">
          Connect Google Drive
        </button>
      )}
      {connected && (
        <div>
          <h2 className="text-xl font-medium mb-2">Detected Resumes</h2>
          <ul className="list-disc pl-5 space-y-1">
            {resumes.map(f => (
              <li key={f.id}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
