// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const role = localStorage.getItem("role");

  // If no role (not logged in) hide sidebar
  if (!role) return null;

  const linkClass = ({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100"}`;

  return (
    <aside className="w-56 bg-gray-50 border-r min-h-[calc(100vh-56px)] pt-6">
      <nav className="flex flex-col gap-1 px-2">
        <NavLink to="/organizer" className={linkClass}>🏠 <span>Overview</span></NavLink>
        <NavLink to="/organizer/hackathons" className={linkClass}>📋 <span>Hackathons</span></NavLink>
        <NavLink to="/organizer/hackathons/create" className={linkClass}>➕ <span>Create</span></NavLink>
        <NavLink to="/organizer/assign" className={linkClass}>👥 <span>Assign Roles</span></NavLink>
      </nav>
    </aside>
  );
}
