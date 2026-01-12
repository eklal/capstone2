import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to continue your fitness journey?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Link
            to="/find-trainers"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Find Trainers</h3>
            <p className="text-gray-600 text-sm">
              Browse and connect with professional trainers
            </p>
          </Link>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-xl font-semibold mb-2">My Bookings</h3>
            <p className="text-gray-600 text-sm">
              View and manage your training sessions
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">Settings</h3>
            <p className="text-gray-600 text-sm">
              Update your profile and preferences
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No recent activity</p>
            <p className="text-sm mt-2">Start by booking a training session!</p>
            <Link
              to="/find-trainers"
              className="inline-block mt-4 bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:opacity-90"
            >
              Find Trainers
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClientDashboard;
