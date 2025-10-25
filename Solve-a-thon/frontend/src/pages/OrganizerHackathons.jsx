import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrganizerHackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchHackathons = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/organizer/hackathons", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHackathons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createHackathon = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/organizer/create-hackathon",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Hackathon Created ✅");
      setTitle("");
      setDescription("");
      fetchHackathons();
    } catch (err) {
      console.error(err);
      alert("Failed to create");
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Organizer Hackathon Dashboard</h2>
      <p>Welcome {user?.name} 👋</p>

      <h3>Create New Hackathon</h3>
      <form onSubmit={createHackathon}>
        <input
          type="text"
          placeholder="Hackathon Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>

      <h3>Your Hackathons</h3>
      {hackathons.length === 0 ? (
        <p>No Hackathons created yet.</p>
      ) : (
        hackathons.map((hack) => (
          <div key={hack._id} style={{ margin: "10px", border: "1px solid #ccc", padding: "10px" }}>
            <h4>{hack.title}</h4>
            <p>{hack.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
