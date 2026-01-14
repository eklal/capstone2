import React, { useEffect, useState } from "react";
import { getBookings, updateBookingStatus, type Booking } from "@/api/bookings";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { FaCalendar, FaClock, FaUser, FaCheck, FaTimes, FaHourglass } from "react-icons/fa";

export default function TrainerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled" | "completed">("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // Get all bookings for this trainer
      const data = await getBookings({ trainer_id: user?.id });
      // Sort by date (newest first)
      const sorted = data.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.start_time}`);
        const dateB = new Date(`${b.date} ${b.start_time}`);
        return dateB.getTime() - dateA.getTime();
      });
      setBookings(sorted);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: "confirmed" | "cancelled" | "completed") => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      alert(`Booking ${newStatus} successfully!`);
      loadBookings(); // Refresh list
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking status");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
      completed: "bg-blue-100 text-blue-800 border-blue-300",
    };

    const icons = {
      pending: <FaHourglass />,
      confirmed: <FaCheck />,
      cancelled: <FaTimes />,
      completed: <FaCheck />,
    };

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-1">Manage your training sessions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Confirmed</p>
          <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all" 
                ? "bg-black text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "pending" 
                ? "bg-yellow-500 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "confirmed" 
                ? "bg-green-500 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Confirmed ({stats.confirmed})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "completed" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400 text-sm mt-2">
              {filter === "all" 
                ? "You don't have any bookings yet" 
                : `No ${filter} bookings`}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left - Booking Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Booking #{booking.id}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaUser className="text-sm" />
                        <span className="font-medium">{booking.client_name || "Client"}</span>
                        {booking.client_email && (
                          <span className="text-sm text-gray-500">({booking.client_email})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendar />
                      <span>{format(new Date(booking.date), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock />
                      <span>{booking.start_time} - {booking.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-semibold">${Number(booking.price).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-500">Session Type:</span>
                    <span className="ml-2 text-gray-700 font-medium">{booking.session_type}</span>
                  </div>

                  {booking.notes && (
                    <div className="text-sm bg-gray-50 p-3 rounded">
                      <span className="text-gray-500 font-medium">Notes:</span>
                      <p className="text-gray-700 mt-1">{booking.notes}</p>
                    </div>
                  )}
                </div>

                {/* Right - Actions */}
                <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                  {booking.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(booking.id!, "confirmed")}
                        className="flex-1 lg:w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <FaCheck />
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking.id!, "cancelled")}
                        className="flex-1 lg:w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <FaTimes />
                        Decline
                      </button>
                    </>
                  )}
                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => handleStatusChange(booking.id!, "completed")}
                      className="flex-1 lg:w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <FaCheck />
                      Complete
                    </button>
                  )}
                  {booking.status === "completed" && (
                    <div className="flex-1 lg:w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-center font-medium text-sm">
                      Session Done
                    </div>
                  )}
                  {booking.status === "cancelled" && (
                    <div className="flex-1 lg:w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-center font-medium text-sm">
                      Cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
