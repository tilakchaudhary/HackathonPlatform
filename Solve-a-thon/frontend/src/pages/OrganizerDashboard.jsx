// src/pages/OrganizerHackathons.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";


export default function OrganizerHackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", startDate: "", endDate: "", status: "Not Started", rounds: "" });
  const [logoFile, setLogoFile] = useState(null);
  const [rulesFile, setRulesFile] = useState(null);

  const [editing, setEditing] = useState(null); // hack id being edited
  const navigate = useNavigate();

  const fetchAll = async () => {
    try {
      const [hRes, uRes] = await Promise.all([
        API.get("/organizer/hackathons"),
        API.get("/organizer/users")
      ]);
      setHackathons(hRes.data || []);
      setUsers(uRes.data || []);
    } catch (err) {
      console.error("fetchAll:", err?.response?.data || err.message);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Create or Update
  const handleSave = async (e) => {
    e && e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (form.startDate) fd.append("startDate", form.startDate);
      if (form.endDate) fd.append("endDate", form.endDate);
      fd.append("status", form.status);
      if (form.rounds) fd.append("rounds", form.rounds);

      if (logoFile) fd.append("logo", logoFile);
      if (rulesFile) fd.append("rules", rulesFile);

      if (editing) {
        await API.put(`/organizer/hackathons/${editing}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await API.post("/organizer/hackathons", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      setForm({ title: "", description: "", startDate: "", endDate: "", status: "Not Started", rounds: "" });
      setLogoFile(null); setRulesFile(null);
      setEditing(null);
      fetchAll();
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (h) => {
    setEditing(h._id);
    setForm({
      title: h.title || "",
      description: h.description || "",
      startDate: h.startDate ? h.startDate.slice(0,10) : "",
      endDate: h.endDate ? h.endDate.slice(0,10) : "",
      status: h.status || "Not Started",
      rounds: (h.rounds || []).join(", ")
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hackathon?")) return;
    try {
      await API.delete(`/organizer/hackathons/${id}`);
      fetchAll();
    } catch (err) { alert("Delete failed"); }
  };

  const handleAssign = async (hackId, userId, type) => {
    if (!userId) return;
    try {
      await API.post(`/organizer/hackathons/${hackId}/${type}`, { userId });
      fetchAll();
    } catch (err) { alert("Assign failed"); }
  };

  const viewDetails = (id) => navigate(`/organizer/hackathons/${id}`);

  return (
    <div className="flex-1">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{editing ? "Edit Hackathon" : "Create Hackathon"}</h2>

        <form onSubmit={handleSave} className="bg-white p-4 rounded shadow mb-6 grid gap-3">
          <input className="border p-2" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <textarea className="border p-2" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" className="border p-2" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
            <input type="date" className="border p-2" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
          </div>

          <div className="flex gap-2">
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="border p-2">
              <option>Not Started</option>
              <option>Ongoing</option>
              <option>Completed</option>
            </select>
            <input className="border p-2 flex-1" placeholder="Rounds (comma separated)" value={form.rounds} onChange={e => setForm({...form, rounds: e.target.value})} />
          </div>

          <div className="flex gap-2 items-center">
            <input type="file" onChange={e => setLogoFile(e.target.files[0])} />
            <input type="file" onChange={e => setRulesFile(e.target.files[0])} />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">{editing ? "Save Changes" : "Create Hackathon"}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ title:"", description:"", startDate:"", endDate:"", status:"Not Started", rounds:"" });}} className="px-4 py-2 border rounded">Cancel</button>}
          </div>
        </form>

        <h3 className="text-xl font-semibold mb-3">Your Hackathons</h3>
        <div className="space-y-4">
          {hackathons.length === 0 && <div className="text-gray-500">No hackathons yet</div>}
          {hackathons.map(h => (
            <div key={h._id} className="bg-white p-4 rounded shadow flex justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{h.title}</div>
                <div className="text-sm text-gray-600">{h.startDate ? new Date(h.startDate).toLocaleDateString() : ""} — {h.endDate ? new Date(h.endDate).toLocaleDateString() : ""} • {h.status}</div>
                <div className="mt-2 text-sm">{h.description}</div>

                <div className="mt-3 flex gap-2 items-center">
                  <select className="border p-1" onChange={(e) => handleAssign(h._id, e.target.value, "participants")}>
                    <option value="">Add participant</option>
                    {users.filter(u => u.role === "participant").map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                  </select>

                  <select className="border p-1" onChange={(e) => handleAssign(h._id, e.target.value, "judges")}>
                    <option value="">Add judge</option>
                    {users.filter(u => u.role === "judge").map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                  </select>
                </div>

                <div className="mt-2 text-xs text-gray-600">
                  Participants: {(h.participants || []).length} • Judges: {(h.judges || []).length}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <button onClick={() => viewDetails(h._id)} className="text-blue-600">View</button>
                  <button onClick={() => handleEdit(h)} className="text-yellow-700">Edit</button>
                  <button onClick={() => handleDelete(h._id)} className="text-red-600">Delete</button>
                </div>

                <div>
                  {h.logoUrl ? <img src={`http://localhost:5000${h.logoUrl}`} alt="logo" className="w-24 h-24 object-cover rounded" /> : <div className="text-xs text-gray-400">No logo</div>}
                  {h.rulesFileUrl && <a className="text-indigo-600 block mt-1" href={`http://localhost:5000${h.rulesFileUrl}`} target="_blank" rel="noreferrer">Rules PDF</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

