import React, { useEffect, useState } from "react";
import { getPaginatedBookings, updateBookingStatus, type Booking } from "@/api/bookings";
import { getTrainerProfile } from "@/api/trainers";
import { useAuth } from "@/hooks/useAuth";
import { format, parseISO } from "date-fns";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { FiCheckCircle, FiXCircle, FiClock, FiCheck } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

export default function TrainerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]); // For stats
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled" | "completed">("all");
  const [trainerProfileId, setTrainerProfileId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    loadTrainerProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (trainerProfileId) {
      loadAllBookingsForStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerProfileId]);

  useEffect(() => {
    if (trainerProfileId) {
      loadBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerProfileId, filter, currentPage]);

  const loadTrainerProfile = async () => {
    if (!user?.id) return;
    
    try {
      const profile = await getTrainerProfile(user.id);
      setTrainerProfileId(profile.id);
    } catch (error) {
      console.error("Error loading trainer profile:", error);
      toast.error("Failed to load trainer profile");
    }
  };

  // Load all bookings for statistics (without pagination)
  const loadAllBookingsForStats = async () => {
    if (!trainerProfileId) return;
    
    try {
      const response = await getPaginatedBookings({ 
        trainer_id: trainerProfileId,
        page_size: 1000 // Get all for stats
      });
      setAllBookings(response.results);
    } catch (error) {
      console.error("Error loading bookings for stats:", error);
    }
  };

  // Load paginated bookings
  const loadBookings = async () => {
    if (!trainerProfileId) return;
    
    try {
      setLoading(true);
      const response = await getPaginatedBookings({ 
        trainer_id: trainerProfileId,
        status: filter !== "all" ? filter : undefined,
        page: currentPage,
        page_size: itemsPerPage
      });
      
      setBookings(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: "confirmed" | "cancelled" | "completed") => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus} successfully!`);
      loadBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking status");
    }
  };

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

  const getStatusIcon = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-yellow-600" />;
      case "confirmed":
        return <FiCheckCircle className="text-green-600" />;
      case "cancelled":
        return <FiXCircle className="text-red-600" />;
      case "completed":
        return <FiCheck className="text-blue-600" />;
    }
  };

  // Calculate stats from all bookings
  const stats = {
    total: allBookings.length,
    pending: allBookings.filter((b) => b.status === "pending").length,
    confirmed: allBookings.filter((b) => b.status === "confirmed").length,
    completed: allBookings.filter((b) => b.status === "completed").length,
    cancelled: allBookings.filter((b) => b.status === "cancelled").length,
  };

  // Pagination (server-side)
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-lg text-gray-600">
          Manage and track all your training sessions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition-all">
          <p className="text-sm text-gray-600 font-medium mb-1">Total Bookings</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-400 hover:shadow-xl transition-all">
          <p className="text-sm text-yellow-700 font-medium mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-400 hover:shadow-xl transition-all">
          <p className="text-sm text-green-700 font-medium mb-1">Confirmed</p>
          <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-400 hover:shadow-xl transition-all">
          <p className="text-sm text-blue-700 font-medium mb-1">Completed</p>
          <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-md mb-8 overflow-hidden">
          <div className="flex overflow-x-auto">
          {[
            { key: "all", label: "All", count: stats.total },
            { key: "pending", label: "Pending", count: stats.pending },
            { key: "confirmed", label: "Confirmed", count: stats.confirmed },
            { key: "completed", label: "Completed", count: stats.completed },
            { key: "cancelled", label: "Cancelled", count: stats.cancelled },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`
                flex-1 min-w-[120px] px-6 py-4 text-sm font-semibold border-b-4 transition-all
                ${
                  filter === tab.key
                    ? "border-[var(--primary)] text-[var(--primary)] bg-red-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : bookings.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Session Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">
                          #{booking.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                            <FaUser />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {booking.client_name || `Client ${booking.client}`}
                            </p>
                            {booking.client_email && (
                              <p className="text-xs text-gray-500">
                                {booking.client_email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900 flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            {format(parseISO(booking.date), "MMM dd, yyyy")}
                          </p>
                          <p className="text-gray-600 flex items-center gap-2 mt-1">
                            <FaClock className="text-gray-400" />
                            {booking.start_time} - {booking.end_time}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {booking.session_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">
                          ${Number(booking.price).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${getStatusClasses(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {booking.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleStatusChange(booking.id!, "confirmed")}
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-semibold"
                                title="Accept"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusChange(booking.id!, "cancelled")}
                                className="px-3 py-1.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-xs font-semibold"
                                title="Decline"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <button
                              onClick={() => handleStatusChange(booking.id!, "completed")}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold"
                            >
                              Complete
                            </button>
                          )}
                          {(booking.status === "completed" || booking.status === "cancelled") && (
                            <span className="px-3 py-1.5 text-gray-500 text-xs">
                              -
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {endIndex} of{" "}
                  {totalCount} bookings
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          currentPage === page
                            ? "bg-[var(--primary)] text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <FaCalendarAlt className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No {filter !== "all" ? filter : ""} bookings found
            </h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "You don't have any bookings yet"
                : `No ${filter} bookings at the moment`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
