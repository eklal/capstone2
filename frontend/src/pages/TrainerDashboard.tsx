// src/pages/TrainerDashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTrainerProfile } from "../api/trainers";
import type { TrainerProfile } from "../api/trainers";
import { getBookings } from "../api/bookings";
import type { Booking } from "../api/bookings";

import SmallStatCard from "../components/trainerDashboard/SmallStatCard";
import RevenueChart from "../components/trainerDashboard/RevenueChart";
import Card from "../components/ui/Card";
import { ShimmerCard } from "../components/ui/Shimmer";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Method to fetch data before rendering (shows shimmer while loading)
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
        getBookings() // Get bookings for logged-in trainer (filtered by backend)
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


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SmallStatCard 
          title="Total Revenue" 
          value={profile ? `$${(Number(profile.hourly_rate || 0) * bookings.length).toLocaleString()}` : ""} 
          loading={loading} 
        />
        <SmallStatCard 
          title="Active Bookings" 
          value={bookings.filter(b => b.status === "confirmed").length} 
          loading={loading} 
        />
        <SmallStatCard 
          title="Pending Requests" 
          value={bookings.filter(b => b.status === "pending").length} 
          loading={loading} 
        />
        <SmallStatCard 
          title="Total Sessions" 
          value={bookings.length} 
          loading={loading} 
        />
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

            <RevenueChart data={undefined} loading={loading} />
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
              <div>
                {bookings.length > 0 ? (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Booking #{booking.id}</p>
                            <p className="text-sm text-gray-600">Status: {booking.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No bookings yet</p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
