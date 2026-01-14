import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTrainerProfile } from "../api/trainers";
import type { TrainerProfile } from "../api/trainers";
import { getBookings } from "../api/bookings";
import type { Booking } from "../api/bookings";
import { format, parseISO } from "date-fns";
import {
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";
import {
  FaUser,
  FaChevronRight,
  FaCalendarPlus,
  FaUserEdit,
  FaClock as FaClockSolid,
} from "react-icons/fa";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBeforeRender = async () => {
    setLoading(true);
    try {
      if (!id) {
        alert("Trainer ID not found in URL");
        navigate("/");
        return;
      }

      const trainerId = parseInt(id);
      const [p, b] = await Promise.all([
        getTrainerProfile(trainerId),
        getBookings(),
      ]);
      setProfile(p);
      setBookings(b);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeforeRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate stats
  const totalRevenue = profile
    ? Number(profile.hourly_rate || 0) * bookings.filter(b => b.status === "completed").length
    : 0;
  const activeBookings = bookings.filter((b) => b.status === "confirmed").length;
  const pendingRequests = bookings.filter((b) => b.status === "pending").length;
  const totalSessions = bookings.filter((b) => b.status === "completed").length;

  // Recent bookings
  const recentBookings = bookings
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
    .slice(0, 5);

  const getStatusClasses = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.user_name}!
        </h1>
        <p className="text-lg text-gray-600">
          Here's what's happening with your training business
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 animate-pulse h-32"
              ></div>
            ))}
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FiDollarSign className="text-2xl text-green-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  ${totalRevenue}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Total Revenue
              </h3>
              <p className="text-xs text-gray-500">This month</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiCalendar className="text-2xl text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {activeBookings}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Active Bookings
              </h3>
              <p className="text-xs text-gray-500">Confirmed sessions</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <FiClock className="text-2xl text-yellow-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {pendingRequests}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Pending Requests
              </h3>
              <p className="text-xs text-gray-500">Awaiting response</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FiCheckCircle className="text-2xl text-purple-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {totalSessions}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Total Sessions
              </h3>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recent Bookings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiCalendar className="text-xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Recent Booking Requests
                </h2>
              </div>
              <button
                onClick={() => navigate("/trainer-bookings")}
                className="text-sm text-[var(--primary)] hover:text-red-700 font-semibold flex items-center gap-1 px-4 py-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                View All <FaChevronRight className="text-xs" />
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-100 rounded-xl h-24"
                  ></div>
                ))}
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                        <FaUser />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {booking.client_name || `Client ${booking.client}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {format(parseISO(booking.date), "MMM dd, yyyy")} •{" "}
                          {booking.start_time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusClasses(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiCalendar className="text-4xl text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-4">
                  No booking requests yet
                </p>
                <p className="text-gray-400 text-sm">
                  Bookings from clients will appear here
                </p>
              </div>
            )}
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FiTrendingUp className="text-xl text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Revenue Overview
                </h2>
              </div>
              <select className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-white hover:bg-gray-50 transition-colors">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 12 months</option>
              </select>
            </div>

            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <FiTrendingUp className="text-4xl text-green-600" />
                </div>
                <p className="text-gray-700 font-bold text-lg mb-2">
                  Revenue Chart Coming Soon
                </p>
                <p className="text-gray-500 text-sm">
                  Track your earnings and growth over time
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Sessions Quick View */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FaClockSolid className="text-xl" />
                </div>
                <h3 className="text-xl font-bold">Quick Tip</h3>
              </div>
            </div>
            <p className="text-white/90 mb-4">
              Keep your availability updated and respond to booking requests within 24 hours to maintain a high rating!
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Your profile is active</span>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Profile Summary */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Profile Summary
            </h3>
            <div className="flex items-center gap-4 mb-6">
              {profile?.profile_pic?.file ? (
                <img
                  src={profile.profile_pic.file}
                  alt={profile.user_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-2xl text-white font-bold">
                  {profile?.user_name?.[0]?.toUpperCase() || "T"}
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">
                  {profile?.user_name}
                </h4>
                <p className="text-sm text-gray-600">
                  {profile?.professional_title || "Personal Trainer"}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Hourly Rate</span>
                <span className="font-bold text-gray-900">
                  ${profile?.hourly_rate || 0}/hr
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-bold text-gray-900">
                  {profile?.years_of_experience || 0}+ years
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-bold text-gray-900">
                  {profile?.city || "N/A"}, {profile?.state || "N/A"}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/trainer-profile/${id}`)}
              className="w-full mt-6 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              View Full Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/trainer-profile/${id}/edit`)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaUserEdit className="text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    Update Profile
                  </span>
                </div>
                <FaChevronRight className="text-gray-400 group-hover:text-gray-600" />
              </button>

              <button
                onClick={() => navigate(`/trainer-profile/${id}/edit`)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FaCalendarPlus className="text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    Set Availability
                  </span>
                </div>
                <FaChevronRight className="text-gray-400 group-hover:text-gray-600" />
              </button>

              <button
                onClick={() => navigate("/trainer-bookings")}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <FaClockSolid className="text-purple-600" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    Manage Bookings
                  </span>
                </div>
                <FaChevronRight className="text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gradient-to-br from-[var(--primary)] to-pink-600 rounded-2xl shadow-md p-6 text-white">
            <h3 className="text-xl font-bold mb-4">This Month's Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Booking Rate</span>
                  <span className="font-bold">85%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Client Satisfaction</span>
                  <span className="font-bold">4.9/5.0</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2"
                    style={{ width: "98%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Response Time</span>
                  <span className="font-bold"> 2 hours</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
