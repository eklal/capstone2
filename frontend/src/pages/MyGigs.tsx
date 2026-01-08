// src/pages/MyGigs.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiEye, FiUpload } from "react-icons/fi";
import { getTrainerGigs, getTrainerBookings, updateBookingStatus, Gig, TrainerBooking, GigStatus } from "../api/gigs";
import Card from "../components/ui/Card";
import { ShimmerCard, ShimmerLine } from "../components/ui/Shimmer";

type GigTab = "all" | "active" | "draft" | "paused";
type BookingTab = "all" | "pending" | "confirmed" | "completed";

export default function MyGigs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [bookings, setBookings] = useState<TrainerBooking[]>([]);
  const [activeGigTab, setActiveGigTab] = useState<GigTab>("all");
  const [activeBookingTab, setActiveBookingTab] = useState<BookingTab>("all");
  const trainerId = 101; // sample trainer ID

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [gigsData, bookingsData] = await Promise.all([
          getTrainerGigs(trainerId),
          getTrainerBookings(trainerId),
        ]);
        setGigs(gigsData);
        setBookings(bookingsData);
      } catch (err) {
        console.error("Failed to fetch gigs and bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter gigs by status
  const filteredGigs = React.useMemo(() => {
    if (activeGigTab === "all") return gigs;
    return gigs.filter((gig) => gig.status === activeGigTab);
  }, [gigs, activeGigTab]);

  // Filter bookings by status
  const filteredBookings = React.useMemo(() => {
    if (activeBookingTab === "all") return bookings;
    return bookings.filter((booking) => booking.status === activeBookingTab);
  }, [bookings, activeBookingTab]);

  // Calculate counts
  const gigCounts = {
    all: gigs.length,
    active: gigs.filter((g) => g.status === "active").length,
    draft: gigs.filter((g) => g.status === "draft").length,
    paused: gigs.filter((g) => g.status === "paused").length,
  };

  const bookingCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  const handleBookingAction = async (bookingId: string, action: "accept" | "decline") => {
    if (action === "accept") {
      const newStatus = "confirmed";
      // Optimistic update
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus as TrainerBooking["status"] } : b))
      );
      // Call API
      try {
        await updateBookingStatus(bookingId, newStatus as TrainerBooking["status"]);
      } catch (err) {
        console.error("Failed to update booking status", err);
        // Rollback on error (simplified - in production you'd want better error handling)
      }
    } else {
      // For decline, remove the booking from the list (or you could add a "rejected" status)
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      try {
        // In a real app, you'd call an API to reject the booking
        await updateBookingStatus(bookingId, "pending" as TrainerBooking["status"]);
      } catch (err) {
        console.error("Failed to decline booking", err);
      }
    }
  };

  const getStatusColor = (status: GigStatus | TrainerBooking["status"]) => {
    switch (status) {
      case "active":
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "draft":
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Gigs</h1>
          <p className="text-gray-600">Manage your training services and packages.</p>
        </div>
        <button
          onClick={() => navigate("/trainer/gigs/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          + Create New Gig
        </button>
      </div>

      {/* Gig Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveGigTab("all")}
          className={`pb-2 px-1 ${
            activeGigTab === "all"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          All Gigs ({gigCounts.all})
        </button>
        <button
          onClick={() => setActiveGigTab("active")}
          className={`pb-2 px-1 ${
            activeGigTab === "active"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Active ({gigCounts.active})
        </button>
        <button
          onClick={() => setActiveGigTab("draft")}
          className={`pb-2 px-1 ${
            activeGigTab === "draft"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Draft ({gigCounts.draft})
        </button>
        <button
          onClick={() => setActiveGigTab("paused")}
          className={`pb-2 px-1 ${
            activeGigTab === "paused"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Paused ({gigCounts.paused})
        </button>
      </div>

      {/* Gigs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse mb-4" />
              <div className="mb-2">
                <ShimmerLine width="w-3/4" height="h-5" />
              </div>
              <div className="mb-4">
                <ShimmerLine width="w-full" height="h-4" />
              </div>
              <ShimmerLine width="w-1/2" height="h-4" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredGigs.map((gig) => (
            <Card key={gig.id} className="overflow-hidden">
              {/* Image/Cover Area */}
              <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center mb-4">
                <span className="text-gray-600 font-medium">{gig.category}</span>
              </div>

              <div className="px-2">
                {/* Title and Status */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{gig.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gig.status)}`}>
                    {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3">{gig.description}</p>

                {/* Price */}
                <p className="text-gray-900 font-semibold mb-3">
                  ${gig.price}/{gig.unit}
                </p>

                {/* Rating and Views */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  {gig.rating ? (
                    <>
                      <span>★ {gig.rating} ({gig.reviews})</span>
                    </>
                  ) : (
                    <span>No reviews</span>
                  )}
                  <span>{gig.views} views</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/trainer/gigs/${gig.id}/edit`)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiEdit className="w-4 h-4" />
                    Edit
                  </button>
                  {gig.status === "draft" ? (
                    <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2">
                      <FiUpload className="w-4 h-4" />
                      Publish
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/trainer/gigs/${gig.id}`)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiEye className="w-4 h-4" />
                      View
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Bookings Section */}
      <div className="mt-12">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Recent Bookings</h2>
          <p className="text-gray-600">Manage your upcoming and pending training sessions.</p>
        </div>

        {/* Booking Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveBookingTab("all")}
            className={`pb-2 px-1 ${
              activeBookingTab === "all"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All ({bookingCounts.all})
          </button>
          <button
            onClick={() => setActiveBookingTab("pending")}
            className={`pb-2 px-1 ${
              activeBookingTab === "pending"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Pending ({bookingCounts.pending})
          </button>
          <button
            onClick={() => setActiveBookingTab("confirmed")}
            className={`pb-2 px-1 ${
              activeBookingTab === "confirmed"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Confirmed ({bookingCounts.confirmed})
          </button>
          <button
            onClick={() => setActiveBookingTab("completed")}
            className={`pb-2 px-1 ${
              activeBookingTab === "completed"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Completed ({bookingCounts.completed})
          </button>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <p className="text-gray-500 text-center py-8">No bookings found</p>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {booking.clientName.charAt(0)}
                      </div>

                      {/* Client Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{booking.clientName}</h4>
                        <p className="text-sm text-gray-600">{booking.gigTitle}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>{booking.date}</span>
                          <span>•</span>
                          <span>{booking.time}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${booking.price}</p>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      {booking.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleBookingAction(booking.id, "accept")}
                            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleBookingAction(booking.id, "decline")}
                            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

