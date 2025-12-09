// src/pages/TrainerDashboard.tsx
import React, { useEffect, useState } from "react";
import { getTrainerProfile,  ProfileData } from "../api/trainers";
import { Booking,updateBookingStatus,getBookings } from "../api/booking";

import SmallStatCard from "../components/trainerDashboard/SmallStatCard";
import RevenueChart from "../components/trainerDashboard/RevenueChart";
import BookingsTable from "../components/trainerDashboard/BookingsTable";
import Card from "../components/ui/Card";
import { ShimmerCard } from "../components/ui/Shimmer";

export default function TrainerDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const trainerId = 101; // sample

  // Method to fetch data before rendering (shows shimmer while loading)
  const fetchBeforeRender = async () => {
    setLoading(true);
    try {
      const [p, b] = await Promise.all([getTrainerProfile(trainerId), getBookings(trainerId)]);
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
  }, []);

  const handleUpdateBooking = async (bookingId: string, status: Booking["status"]) => {
    // show optimistic change locally (optional)
    setBookings((prev) => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    // call API
    const res = await updateBookingStatus(bookingId, status);
    if (!res.ok) {
      // rollback if needed (not implemented here)
      console.error("Failed to update booking");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SmallStatCard title="Total Revenue" value={profile ? `$${profile.totalRevenue.toLocaleString()}` : ""} loading={loading} />
        <SmallStatCard title="Active Bookings" value={profile ? profile.activeBookings : ""} loading={loading} />
        <SmallStatCard title="Pending Requests" value={profile ? profile.pendingRequests : ""} loading={loading} />
        <SmallStatCard title="Completed Sessions" value={profile ? profile.completedSessions : ""} loading={loading} />
      </div>

      {/* Chart + quick actions area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Revenue Overview</h2>
              <select className="border px-2 py-1 rounded text-sm">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>

            <RevenueChart data={profile?.revenueSeries} loading={loading} />
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button className="px-3 py-2 border rounded text-sm text-left">+ Create New Gig</button>
              <button className="px-3 py-2 border rounded text-sm text-left">✏️ Update Profile</button>
              <button className="px-3 py-2 border rounded text-sm text-left">📅 Set Availability</button>
            </div>
          </Card>
        </div>
      </div>

      {/* Bookings */}
      <div className="mb-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Booking Requests</h2>
            <a className="text-sm text-gray-500">View All</a>
          </div>

          <div>
            {loading ? <div className="space-y-3"><ShimmerCard /><ShimmerCard /></div> : (
              <BookingsTable bookings={bookings} loading={false} onAction={handleUpdateBooking} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
