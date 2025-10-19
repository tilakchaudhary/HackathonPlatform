import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">
          {user?.role === 'admin' && 'Admin Dashboard'}
          {user?.role === 'judge' && 'Judge Dashboard'}
          {user?.role === 'organizer' && 'Organizer Dashboard'}
          {user?.role === 'participant' && 'Participant Dashboard'}
        </h1>
        <div>
          <span className="mr-4">{user?.name} ({user?.role})</span>
          <button
            onClick={logout}
            className="py-1 px-3 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        {user?.role === 'admin' && (
          <p>Welcome Admin! Here you can manage users, hackathons, and settings.</p>
        )}
        {user?.role === 'judge' && (
          <p>Welcome Judge! You can review and score hackathon submissions.</p>
        )}
        {user?.role === 'organizer' && (
          <p>Welcome Organizer! You can create and manage hackathons.</p>
        )}
        {user?.role === 'participant' && (
          <p>Welcome Participant! You can join hackathons and submit projects.</p>
        )}
      </div>
    </div>
  );
}
