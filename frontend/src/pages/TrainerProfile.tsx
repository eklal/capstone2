import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTrainerProfile } from "@/api/trainers";
import { getTrainerAvailability } from "@/api/availability";
import type { TrainerProfile as TrainerProfileType } from "@/api/trainers";
import type { AvailabilitySlot } from "@/api/availability";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCertificate,
  FaStar,
  FaEye,
  FaThumbsUp,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";
import { FiEdit, FiCalendar, FiAward } from "react-icons/fi";

const TrainerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<TrainerProfileType | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      if (!id) {
        alert("Trainer ID not found in URL");
        navigate("/");
        return;
      }

      const urlId = parseInt(id);
      
      // First, fetch the trainer profile (can use either user_id or trainer_profile_id)
      const profileData = await getTrainerProfile(urlId);
      setProfile(profileData);
      
      // Then fetch availability using the trainer profile ID
      const availabilityData = await getTrainerAvailability(profileData.id);
      setAvailability(availabilityData);
    } catch (error) {
      console.error("Error loading profile:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          alert("Trainer profile not found. Please complete your profile setup.");
          navigate(`/trainer-profile/${id}/edit`);
          return;
        }
      }
      alert("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
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
      (slot) =>
        slot.day_of_week.toLowerCase() === day.toLowerCase() &&
        slot.is_available
    );
    if (slots.length === 0) return null;

    // Return all time slots for the day
    return slots.map(slot => 
      `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Profile not found</p>
          <button
            onClick={() => navigate(`/trainer-profile/${id}/edit`)}
            className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Complete Profile Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-lg text-gray-600">
              Manage your trainer profile and showcase your expertise
            </p>
          </div>
          <button
            onClick={() => navigate(`/trainer-profile/${id}/edit`)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-lg"
          >
            <FiEdit /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <div className="flex items-start gap-6 mb-6">
                {profile.profile_pic?.file ? (
                  <img
                    src={profile.profile_pic.file}
                    alt={profile.user_name}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-gray-200 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-5xl text-white font-bold shadow-lg">
                    {profile.user_name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile.user_name}
                  </h2>
                  <p className="text-xl text-gray-600 mb-4">
                    {profile.professional_title || "Personal Trainer"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span>
                        {profile.city}, {profile.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBriefcase className="text-blue-500" />
                      <span>{profile.years_of_experience}+ years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-green-500" />
                      <span>${profile.hourly_rate}/hour</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaEnvelope className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FaPhone className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-xl text-gray-700" />
                <h3 className="text-2xl font-bold text-gray-900">About Me</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {profile.bio || "No bio added yet. Click 'Edit Profile' to add your bio."}
              </p>
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <FiAward className="text-xl text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Specializations
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {profile.specialisations && profile.specialisations.length > 0 ? (
                  profile.specialisations.map((spec) => (
                    <span
                      key={spec.id}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl text-sm font-semibold border-2 border-blue-200"
                    >
                      {spec.name}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No specializations added yet
                  </p>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <FaCertificate className="text-xl text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Certifications
                </h3>
              </div>
              <div className="space-y-3">
                {profile.certifications && profile.certifications.length > 0 ? (
                  profile.certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-300 transition-colors"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaCertificate className="text-green-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {cert.file
                            .split("/")
                            .pop()
                            ?.replace(/\.[^/.]+$/, "")}
                        </p>
                        <a
                          href={cert.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                        >
                          View Certificate →
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No certifications uploaded yet
                  </p>
                )}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <FaStar className="text-xl text-yellow-500" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Recent Reviews
                  </h3>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    S
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900">
                        Sarah Johnson
                      </span>
                      <span className="text-yellow-500">★★★★★</span>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Amazing trainer! Helped me lose 15 pounds and gain so much
                      strength. The nutrition advice was spot on and the workouts
                      are challenging but fun.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Availability */}
          <div className="space-y-6">
            {/* Profile Stats */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Profile Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaEye className="text-blue-600 text-xl" />
                    <span className="text-gray-700 font-medium">
                      Profile Views
                    </span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">1,247</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaStar className="text-yellow-600 text-xl" />
                    <span className="text-gray-700 font-medium">Rating</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    4.9/5.0
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaThumbsUp className="text-green-600 text-xl" />
                    <span className="text-gray-700 font-medium">Reviews</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">87</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaClock className="text-purple-600 text-xl" />
                    <span className="text-gray-700 font-medium">
                      Response Rate
                    </span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">98%</span>
                </div>
              </div>
            </div>

            {/* Availability Schedule */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-xl text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Availability
                  </h3>
                </div>
                <button
                  onClick={() => navigate(`/trainer-profile/${id}/edit`)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Update
                </button>
              </div>
              <div className="space-y-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => {
                  const timeSlots = getAvailabilityDisplay(day);
                  const isAvailable = timeSlots !== null && timeSlots.length > 0;
                  
                  return (
                    <div
                      key={day}
                      className={`p-3 rounded-lg ${
                        isAvailable
                          ? "bg-green-50 border-2 border-green-200"
                          : "bg-gray-50 border-2 border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-gray-900">{day}</span>
                        <div className={`text-sm font-medium text-right ${
                          isAvailable ? "text-green-700" : "text-gray-500"
                        }`}>
                          {isAvailable ? (
                            <div className="space-y-1">
                              {timeSlots.map((slot, index) => (
                                <div key={index}>{slot}</div>
                              ))}
                            </div>
                          ) : (
                            <span>Unavailable</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Card */}
            <div className="bg-gradient-to-br from-[var(--primary)] to-pink-600 rounded-2xl shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Complete Your Profile</h3>
              <p className="text-sm mb-4 text-white/90">
                A complete profile gets 3x more booking requests!
              </p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Profile photo added</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Bio completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Certifications uploaded</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/trainer-profile/${id}/edit`)}
                className="w-full py-3 bg-white text-[var(--primary)] rounded-xl hover:bg-gray-100 transition-colors font-bold"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
