import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiBarChart2, FiUser, FiCalendar, FiDollarSign, FiSettings } from "react-icons/fi";
import Topbar from "./TrainerNavbar";

export default function TrainerPageContainer() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: "/trainer-dashboard", label: "Dashboard", icon: FiBarChart2 },
    { path: "/trainer-profile", label: "Profile", icon: FiUser },
    { path: "/trainer/gigs", label: "Gigs", icon: FiUser },
    { path: "/trainer-bookings", label: "Bookings", icon: FiCalendar },
    { path: "/trainer-income", label: "Income", icon: FiDollarSign },
    { path: "/trainer-settings", label: "Settings", icon: FiSettings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Topbar - Above sidebar and main content */}
      <Topbar />

      {/* Sidebar and Main Content Container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 text-white shadow-md transition-all duration-300 ${
            open ? "w-64" : "w-16"
          }`}
        >
          <button
            className="p-4 text-white hover:bg-gray-700 w-full text-left"
            onClick={() => setOpen(!open)}
          >
            {open ? "<<" : ">>"}
          </button>

          {open && (
            <nav className="mt-6 flex flex-col gap-1 px-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {!open && (
            <nav className="mt-6 flex flex-col gap-1 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </nav>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
