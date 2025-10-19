import React, { useState, useEffect } from "react";

export default function OrganizerDashboard() {
  const [hackathons, setHackathons] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const token = localStorage.getItem("token");

  // Load hackathons
  async function fetchHackathons() {
    const res = await fetch("http://localhost:5000/api/organizer/hackathons",{
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setHackathons(data);
  }

  useEffect(() => { fetchHackathons(); }, []);

  // Create new hackathon
  async function handleCreate(e) {
    e.preventDefault();
    await fetch("http://localhost:5000/api/organizer/hackathons", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description, startDate, endDate }),
    });
    setTitle(""); setDescription(""); setStartDate(""); setEndDate("");
    fetchHackathons();
  }

  // Delete hackathon
  async function handleDelete(id) {
    await fetch(`http://localhost:5000/api/organizer/hackathons/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchHackathons();
  }

  // Add participant (for testing: just enter userId)
  async function handleAddParticipant(hackathonId) {
    const userId = prompt("Enter participant userId:");
    if (!userId) return;
    await fetch(`http://localhost:5000/api/organizer/hackathons/${hackathonId}/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId }),
    });
    fetchHackathons();
  }

  // Assign judge (enter judgeId)
  async function handleAssignJudge(hackathonId) {
    const judgeId = prompt("Enter judge userId:");
    if (!judgeId) return;
    await fetch(`http://localhost:5000/api/organizer/hackathons/${hackathonId}/judges`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ judgeId }),
    });
    fetchHackathons();
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-6">Organizer Dashboard — Manage Hackathons</h1>

      {/* Create Hackathon Form */}
      <form onSubmit={handleCreate} className="space-y-4 mb-8">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2 w-full" />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-2 w-full" />
        <input value={startDate} onChange={e => setStartDate(e.target.value)} type="date" className="border p-2 w-full" />
        <input value={endDate} onChange={e => setEndDate(e.target.value)} type="date" className="border p-2 w-full" />
        <button className="bg-blue-600 text-white py-2 px-4 rounded">Create Hackathon</button>
      </form>

      {/* Hackathon List */}
      <h2 className="text-lg font-bold mb-4">Existing Hackathons</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Dates</th>
            <th className="border px-2 py-1">Participants</th>
            <th className="border px-2 py-1">Judges</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hackathons.map(h => (
            <tr key={h._id} className="border">
              <td className="border px-2 py-1">{h.title}</td>
              <td className="border px-2 py-1">{h.startDate?.slice(0,10)} → {h.endDate?.slice(0,10)}</td>
              <td className="border px-2 py-1">{h.participants?.length || 0}</td>
              <td className="border px-2 py-1">{h.judges?.length || 0}</td>
              <td className="border px-2 py-1 space-x-2">
                <button onClick={() => handleAddParticipant(h._id)} className="bg-green-500 text-white px-2 py-1 rounded">+ Participant</button>
                <button onClick={() => handleAssignJudge(h._id)} className="bg-purple-500 text-white px-2 py-1 rounded">+ Judge</button>
                <button onClick={() => handleDelete(h._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
