// src/pages/HackathonDetails.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

export default function HackathonDetails() {
  const { id } = useParams();
  const [hack, setHack] = useState(null);
  const [users, setUsers] = useState([]);
  const [round, setRound] = useState("");
  const [files, setFiles] = useState({ logo: null, rules: null });
  const navigate = useNavigate();

  const fetch = async () => {
    try {
      const [hRes, uRes] = await Promise.all([
        API.get("/organizer/hackathons"),
        API.get("/organizer/users")
      ]);
      const found = (hRes.data || []).find(x => x._id === id);
      setHack(found || null);
      setUsers(uRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetch(); }, [id]);

  if (!hack) return <div className="p-6">Loading...</div>;

  const removeUser = async (role, userId) => {
    if (!window.confirm("Remove user?")) return;
    try {
      await API.delete(`/organizer/hackathons/${id}/${role}/${userId}`);
      fetch();
    } catch (err) { alert("Failed"); }
  };

  const addRound = async () => {
    if (!round.trim()) return;
    try {
      const newRounds = [...(hack.rounds || []), round];
      await API.put(`/organizer/hackathons/${id}`, { rounds: newRounds });
      setRound("");
      fetch();
    } catch (err) { alert("Failed add round"); }
  };

  const changeStatus = async (s) => {
    try {
      await API.put(`/organizer/hackathons/${id}`, { status: s });
      fetch();
    } catch (err) { alert("Failed change status"); }
  };

  const uploadFiles = async (e) => {
    e && e.preventDefault();
    try {
      const fd = new FormData();
      if (files.logo) fd.append("logo", files.logo);
      if (files.rules) fd.append("rules", files.rules);
      await API.put(`/organizer/hackathons/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setFiles({ logo: null, rules: null });
      fetch();
    } catch (err) { alert("Upload failed"); }
  };

  return (
    <div className="p-6">
      <button className="mb-4 text-sm text-blue-600" onClick={() => navigate(-1)}>← Back</button>
      <h1 className="text-2xl font-bold">{hack.title}</h1>
      <p className="text-gray-600">{hack.description}</p>
      <div className="mt-3 text-sm text-gray-500">{hack.startDate ? new Date(hack.startDate).toLocaleDateString() : ""} — {hack.endDate ? new Date(hack.endDate).toLocaleDateString() : ""}</div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Participants</h3>
          <ul className="list-disc ml-5">
            {(hack.participants || []).map(p => (
              <li key={p._id} className="flex justify-between items-center">
                <span>{p.name} ({p.email})</span>
                <button onClick={() => removeUser("participants", p._id)} className="text-red-600 text-sm">Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Judges</h3>
          <ul className="list-disc ml-5">
            {(hack.judges || []).map(j => (
              <li key={j._id} className="flex justify-between items-center">
                <span>{j.name} ({j.email})</span>
                <button onClick={() => removeUser("judges", j._id)} className="text-red-600 text-sm">Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Rounds</h3>
          <ul className="list-disc ml-5">
            {(hack.rounds || []).map((r, idx) => <li key={idx}>{r}</li>)}
          </ul>
          <div className="mt-3 flex gap-2">
            <input className="border p-2 flex-1" placeholder="New round name" value={round} onChange={e => setRound(e.target.value)} />
            <button onClick={addRound} className="px-3 py-1 bg-green-600 text-white rounded">Add</button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Status</h3>
          <div className="flex gap-2">
            <button onClick={() => changeStatus("Not Started")} className="px-3 py-1 border rounded">Not Started</button>
            <button onClick={() => changeStatus("Ongoing")} className="px-3 py-1 border rounded">Ongoing</button>
            <button onClick={() => changeStatus("Completed")} className="px-3 py-1 border rounded">Completed</button>
          </div>

          <h3 className="font-semibold mt-4 mb-2">Upload Logo / Rules</h3>
          <form onSubmit={uploadFiles} className="flex flex-col gap-2">
            <input type="file" onChange={e => setFiles({...files, logo: e.target.files[0]})} />
            <input type="file" onChange={e => setFiles({...files, rules: e.target.files[0]})} />
            <div className="flex gap-2">
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Upload</button>
              <button type="button" onClick={() => { setFiles({ logo: null, rules: null }); }} className="px-3 py-1 border rounded">Cancel</button>
            </div>
          </form>

          {hack.logoUrl && <img src={`http://localhost:5000${hack.logoUrl}`} alt="logo" className="w-32 mt-3" />}
          {hack.rulesFileUrl && <a href={`http://localhost:5000${hack.rulesFileUrl}`} target="_blank" rel="noreferrer" className="block mt-2 text-indigo-600">Download rules</a>}
        </div>
      </div>
    </div>
  );
}
