// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="w-full bg-white border-b py-3 px-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold">HACKFLY</div>
        <div className="text-sm text-gray-600">Organizer Console</div>
      </div>

      <div className="flex items-center gap-4">
        {user && <div className="text-sm">{user.name} — <span className="text-xs text-gray-500">{user.role}</span></div>}
        <button onClick={logout} className="bg-red-600 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </div>
  );
}
