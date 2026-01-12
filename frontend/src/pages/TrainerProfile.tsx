import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainerProfile } from "@/api/trainers";
import { getTrainerAvailability } from "@/api/availability";
import type { TrainerProfile as TrainerProfileType } from "@/api/trainers";
import type { AvailabilitySlot } from "@/api/availability";

const TrainerProfile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<TrainerProfileType | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Get trainer ID from current user or route params
  const trainerId = 1; // TODO: Get from auth context or route

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, availabilityData] = await Promise.all([
        getTrainerProfile(trainerId),
        getTrainerAvailability(trainerId),
      ]);
      setProfile(profileData);
      setAvailability(availabilityData);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityForDay = (day: string) => {
    const slots = availability.filter(
      (slot) => slot.day_of_week.toLowerCase() === day.toLowerCase()
    );
    if (slots.length === 0) return "Unavailable";
    
    return slots
      .map((slot) => `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`)
      .join(", ");
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAvailabilityDisplay = (day: string) => {
    const slots = availability.filter(
      (slot) => slot.day_of_week.toLowerCase() === day.toLowerCase() && slot.is_available
    );
    if (slots.length === 0) return "Unavailable";
    
    const slot = slots[0];
    return `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`;
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!profile) {
    return <div className="p-8">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <button
              onClick={() => navigate("/profile/edit")}
              className="bg-black text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
            >
              <span>✏️</span> Edit Profile
            </button>
          </div>
          <p className="text-gray-600 mb-6">
            Manage your trainer profile and showcase your expertise.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2">
              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-lg font-semibold">Profile Information</h2>
                </div>

                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
                    {profile.profile_pic ? (
                      <img
                        src={profile.profile_pic.file}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{profile.user_name}</h3>
                    <p className="text-gray-600">{profile.professional_title}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span>📍 {profile.city}, {profile.state}</span>
                      <span>📅 Joined Jan 2023</span>
                    </div>
                  </div>
                </div>

                {/* Form Fields - Read Only */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.user_name}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={`${profile.years_of_experience}+ years`}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md bg-gray-50 h-24"
                  />
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialisations?.map((spec) => (
                      <span
                        key={spec.id}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {spec.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="border rounded-lg p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Reviews</h2>
                  <button className="text-sm text-blue-600">View All Reviews</button>
                </div>

                {/* Review Items */}
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      S
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">Sarah Johnson</span>
                        <span className="text-yellow-500">★★★★★</span>
                        <span className="text-sm text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Alex is an amazing trainer! He helped me lose 15 pounds and gain so
                        much strength. His nutrition advice was spot on and his workouts are
                        challenging but fun.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats and Availability */}
            <div className="space-y-6">
              {/* Profile Stats */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Profile Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-semibold">★★★★★ 4.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-semibold">87</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-semibold">98%</span>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      🎓
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">NASM-CPT</p>
                      <p className="text-sm text-gray-500">Expires: Dec 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      🎓
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Nutrition Coach</p>
                      <p className="text-sm text-gray-500">Expires: Mar 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Availability</h3>
                  <button
                    onClick={() => navigate("/profile/edit")}
                    className="text-sm text-blue-600"
                  >
                    Update Schedule
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-600">{day}</span>
                      <span className="font-medium">
                        {getAvailabilityDisplay(day)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
