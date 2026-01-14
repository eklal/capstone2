import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClientPageContainer from "@/components/layout/ClientPageContainer";
import { useAuth } from "@/hooks/useAuth";
import { getBookings, updateBookingStatus, type Booking } from "@/api/bookings";
import { getTrainerProfile, type TrainerProfile } from "@/api/trainers";
import { format, parseISO, isFuture } from "date-fns";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaStar,
  FaSearch,
  FaCreditCard,
  FaUserEdit,
  FaChevronRight,
} from "react-icons/fa";
import { FiCalendar, FiClock, FiUsers, FiDollarSign } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

interface TrainerWithProfile extends TrainerProfile {
  bookingsCount?: number;
}

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trainers, setTrainers] = useState<TrainerWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    hoursTrained: 0,
    activeTrainers: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    if (user?.role === "client") {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all bookings for the client
      const bookingsData = await getBookings();
      setBookings(bookingsData);

      // Calculate stats
      const completed = bookingsData.filter((b) => b.status === "completed");
      const totalHours = completed.reduce((acc, b) => {
        const start = parseISO(`2000-01-01T${b.start_time}`);
        const end = parseISO(`2000-01-01T${b.end_time}`);
        const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return acc + diff;
      }, 0);

      const totalSpent = completed.reduce(
        (acc, b) => acc + Number(b.price),
        0
      );

      // Get unique trainers
      const trainerIds = [
        ...new Set(bookingsData.map((b) => b.trainer)),
      ];
      const trainerProfiles = await Promise.all(
        trainerIds.map(async (id) => {
          try {
            const profile = await getTrainerProfile(id);
            const bookingsCount = bookingsData.filter(
              (b) => b.trainer === id
            ).length;
            return { ...profile, bookingsCount };
          } catch (error) {
            console.error(`Error fetching trainer ${id}:`, error);
            return null;
          }
        })
      );

      const validTrainers = trainerProfiles.filter(
        (t) => t !== null
      ) as TrainerWithProfile[];
      setTrainers(validTrainers);

      setStats({
        totalSessions: completed.length,
        hoursTrained: Math.round(totalHours),
        activeTrainers: trainerIds.length,
        totalSpent: totalSpent,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await updateBookingStatus(id, "cancelled");
      toast.success("Booking cancelled successfully");
      loadDashboardData();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  // Filter bookings
  const upcomingBookings = bookings
    .filter(
      (b) =>
        (b.status === "pending" || b.status === "confirmed") &&
        isFuture(parseISO(b.date))
    )
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3);

  const recentActivity = bookings
    .sort(
      (a, b) =>
        parseISO(b.created_at || b.date).getTime() -
        parseISO(a.created_at || a.date).getTime()
    )
    .slice(0, 4);

  if (!user || user.role !== "client") {
    return (
      <ClientPageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">
              Please log in as a client to view this page
            </p>
            <Link
              to="/login"
              className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </ClientPageContainer>
    );
  }

  return (
    <ClientPageContainer>
      <Toaster position="top-center" />
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-lg text-gray-600">
            Here's what's happening with your fitness journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FiCalendar className="text-2xl text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.totalSessions}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Total Sessions
            </h3>
            <p className="text-xs text-gray-500">This month</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <FiClock className="text-2xl text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.hoursTrained}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Hours Trained
            </h3>
            <p className="text-xs text-gray-500">This month</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FiUsers className="text-2xl text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.activeTrainers}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Active Trainers
            </h3>
            <p className="text-xs text-gray-500">Working with</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <FiDollarSign className="text-2xl text-red-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                ${stats.totalSpent}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Total Spent
            </h3>
            <p className="text-xs text-gray-500">This month</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Sessions & Your Trainers */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upcoming Sessions
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-100 rounded-xl h-24"
                    ></div>
                  ))}
                </div>
              ) : upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-2xl text-gray-600">
                          <FaUser />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {booking.trainer_name || `Trainer ${booking.trainer}`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {format(parseISO(booking.date), "MMM dd, yyyy")} •{" "}
                            {booking.start_time}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <button
                            onClick={() =>
                              handleCancelBooking(booking.id!)
                            }
                            className="px-4 py-2 text-sm border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold">
                            Join
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaCalendarAlt className="text-4xl text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg mb-4">
                    No upcoming sessions
                  </p>
                  <button
                    onClick={() => navigate("/find-trainers")}
                    className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    Book a Session
                  </button>
                </div>
              )}

              {upcomingBookings.length > 0 && (
                <button
                  onClick={() => navigate("/client-dashboard")}
                  className="w-full mt-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  View All Bookings
                </button>
              )}
            </div>

            {/* Your Trainers */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Trainers
              </h2>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-100 rounded-xl h-48"
                    ></div>
                  ))}
                </div>
              ) : trainers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trainers.slice(0, 2).map((trainer) => (
                    <div
                      key={trainer.id}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:border-[var(--primary)] transition-all cursor-pointer"
                      onClick={() => navigate(`/trainers/${trainer.id}`)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {trainer.profile_pic?.file ? (
                          <img
                            src={trainer.profile_pic.file}
                            alt={trainer.user_name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-2xl text-white font-bold">
                            {trainer.user_name[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {trainer.user_name}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {trainer.professional_title || "Personal Trainer"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <FaStar />
                          <span className="font-semibold">4.9</span>
                        </div>
                        <span className="text-gray-500">
                          {trainer.bookingsCount || 0} sessions
                        </span>
                      </div>
                      <button className="w-full mt-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm">
                        Book Session
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    You haven't worked with any trainers yet
                  </p>
                  <button
                    onClick={() => navigate("/find-trainers")}
                    className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    Find Trainers
                  </button>
                </div>
              )}

              {trainers.length > 0 && (
                <button
                  onClick={() => navigate("/find-trainers")}
                  className="w-full mt-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Find More Trainers
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Recent Activity & Quick Actions */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Recent Activity
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-100 rounded-lg h-16"
                    ></div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="mt-1">
                        {booking.status === "completed" ? (
                          <FaCheckCircle className="text-green-500 text-lg" />
                        ) : booking.status === "confirmed" ? (
                          <FaClock className="text-blue-500 text-lg" />
                        ) : booking.status === "cancelled" ? (
                          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                            ✕
                          </div>
                        ) : (
                          <FaClock className="text-yellow-500 text-lg" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {booking.status === "completed"
                            ? "Session completed with"
                            : booking.status === "confirmed"
                            ? "Session confirmed with"
                            : booking.status === "cancelled"
                            ? "Session cancelled with"
                            : "Booking request sent to"}{" "}
                          {booking.trainer_name || `Trainer ${booking.trainer}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {booking.created_at
                            ? format(
                                parseISO(booking.created_at),
                                "MMM dd, h:mm a"
                              )
                            : format(parseISO(booking.date), "MMM dd")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/find-trainers")}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaSearch className="text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-900">
                      Find New Trainer
                    </span>
                  </div>
                  <FaChevronRight className="text-gray-400 group-hover:text-gray-600" />
                </button>

                <button
                  onClick={() => navigate("/client-dashboard")}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FaCalendarAlt className="text-green-600" />
                    </div>
                    <span className="font-semibold text-gray-900">
                      Book Session
                    </span>
                  </div>
                  <FaChevronRight className="text-gray-400 group-hover:text-gray-600" />
                </button>

                <button
                  onClick={() => navigate("/client-dashboard")}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <FaCreditCard className="text-purple-600" />
                    </div>
                    <span className="font-semibold text-gray-900">
                      Payment Methods
                    </span>
                  </div>
                  <FaChevronRight className="text-gray-400 group-hover:text-gray-600" />
                </button>

                <button
                  onClick={() => navigate("/client-dashboard")}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <FaUserEdit className="text-red-600" />
                    </div>
                    <span className="font-semibold text-gray-900">
                      Edit Profile
                    </span>
                  </div>
                  <FaChevronRight className="text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </ClientPageContainer>
  );
};

export default ClientDashboard;
