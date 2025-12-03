import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

export default function TrainerPageContainer() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md transition-all duration-300 ${
          open ? "w-64" : "w-16"
        }`}
      >
        <button
          className="p-4"
          onClick={() => setOpen(!open)}
        >
          {open ? "<<" : ">>"}
        </button>

        {open && (
          <nav className="mt-6 flex flex-col gap-4 px-4">
            <Link to="/trainer-dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/trainer-profile" className="hover:text-blue-600">Profile</Link>
            <Link to="/trainer-bookings" className="hover:text-blue-600">Bookings</Link>
            <Link to="/trainer-settings" className="hover:text-blue-600">Settings</Link>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
