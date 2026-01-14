import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookings, updateBookingStatus, type Booking } from "@/api/bookings";
import { format, parseISO } from "date-fns";
import ClientPageContainer from "@/components/layout/ClientPageContainer";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaInfoCircle,
  FaDollarSign,
} from "react-icons/fa";
import { FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<Booking["status"] | "all">("all");

  useEffect(() => {
    loadBookings();
  }, [filterStatus]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const filters = filterStatus === "all" ? {} : { status: filterStatus };
      const data = await getBookings(filters);
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await updateBookingStatus(id, "cancelled");
      toast.success("Booking cancelled successfully");
      loadBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
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
        return <FiCheckCircle className="text-blue-600" />;
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    filterStatus === "all" ? true : booking.status === filterStatus
  );

  // Stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const completedBookings = bookings.filter((b) => b.status === "completed").length;

  return (
    <ClientPageContainer>
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
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <p className="text-sm text-gray-600 font-medium mb-1">Total Bookings</p>
          <p className="text-3xl font-bold text-gray-900">{totalBookings}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
          <p className="text-sm text-yellow-700 font-medium mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingBookings}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-green-200">
          <p className="text-sm text-green-700 font-medium mb-1">Confirmed</p>
          <p className="text-3xl font-bold text-green-600">{confirmedBookings}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium mb-1">Completed</p>
          <p className="text-3xl font-bold text-blue-600">{completedBookings}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-md mb-8 overflow-hidden">
        <div className="flex overflow-x-auto">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as Booking["status"] | "all")}
              className={`
                flex-1 min-w-[120px] px-6 py-4 text-sm font-semibold border-b-4 transition-all
                ${
                  filterStatus === status
                    ? "border-[var(--primary)] text-[var(--primary)] bg-red-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-6 h-48 animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Section - Booking Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl">
                        <FaUser />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {booking.trainer_name || `Trainer ${booking.trainer}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Booking #{booking.id}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border-2 ${getStatusClasses(
                        booking.status
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaCalendarAlt className="text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-semibold">
                          {format(parseISO(booking.date), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaClock className="text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-semibold">
                          {booking.start_time} - {booking.end_time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaDollarSign className="text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-semibold">
                          ${Number(booking.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaInfoCircle className="text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Session Type</p>
                        <p className="font-semibold">{booking.session_type}</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {booking.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 font-semibold mb-1">
                        Notes:
                      </p>
                      <p className="text-sm text-gray-700">{booking.notes}</p>
                    </div>
                  )}
                </div>

                {/* Right Section - Actions */}
                <div className="flex lg:flex-col gap-3 lg:min-w-[180px]">
                  {booking.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleCancelBooking(booking.id!)}
                        className="flex-1 lg:flex-none px-5 py-3 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        <FiXCircle /> Cancel
                      </button>
                      <button
                        onClick={() => navigate(`/trainers/${booking.trainer}`)}
                        className="flex-1 lg:flex-none px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm"
                      >
                        View Trainer
                      </button>
                    </>
                  )}
                  {booking.status === "confirmed" && (
                    <>
                      <button className="flex-1 lg:flex-none px-5 py-3 bg-[var(--primary)] text-white rounded-xl hover:bg-red-700 transition-colors font-semibold text-sm">
                        Join Session
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.id!)}
                        className="flex-1 lg:flex-none px-5 py-3 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-colors font-semibold text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === "completed" && (
                    <>
                      <button className="flex-1 lg:flex-none px-5 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-semibold text-sm flex items-center justify-center gap-2">
                        <FaInfoCircle /> Leave Review
                      </button>
                      <button className="flex-1 lg:flex-none px-5 py-3 bg-[var(--primary)] text-white rounded-xl hover:bg-red-700 transition-colors font-semibold text-sm">
                        Book Again
                      </button>
                    </>
                  )}
                  {booking.status === "cancelled" && (
                    <button
                      onClick={() => navigate(`/trainers/${booking.trainer}`)}
                      className="flex-1 lg:flex-none px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm"
                    >
                      View Trainer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FaCalendarAlt className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No {filterStatus !== "all" ? filterStatus : ""} bookings found
          </h3>
          <p className="text-gray-500 mb-6">
            {filterStatus === "all"
              ? "Start by booking a training session!"
              : `You don't have any ${filterStatus} bookings at the moment.`}
          </p>
          <button
            onClick={() => navigate("/find-trainers")}
            className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
          >
            Find Trainers
          </button>
        </div>
      )}
    </ClientPageContainer>
  );
};

export default MyBookings;
