import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4">
        <Navbar />
        <Outlet />    {/* ✅ This loads the selected dashboard content */}
      </div>
    </div>
  );
}
