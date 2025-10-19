import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ParticipantDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Participant Dashboard</h1>
      <p>Welcome, {user?.name} (Participant)</p>

      <div className="mt-6 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Participant Features</h2>
        <ul className="list-disc list-inside">
          <li>Join or create a team</li>
          <li>Submit project</li>
          <li>View hackathon timeline</li>
        </ul>
      </div>

      <button onClick={logout} className="mt-6 py-2 px-4 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  );
}
