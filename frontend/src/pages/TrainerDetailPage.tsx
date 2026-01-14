import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrainerProfile } from "@/api/trainers";
import type { TrainerProfile } from "@/api/trainers";
import BookingCalendar from "@/components/BookingCalendar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { 
  FaCertificate, 
  FaPlay, 
  FaStar, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaComments,
  FaArrowLeft,
  FaAward
} from "react-icons/fa";

const TrainerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const trainerId = parseInt(id || "0");

  const [trainer, setTrainer] = useState<TrainerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedEndTime, setSelectedEndTime] = useState<string>("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (trainerId) {
      loadTrainerData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerId]);

  const loadTrainerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrainerProfile(trainerId);
      setTrainer(data);
    } catch (err) {
      console.error("Error loading trainer:", err);
      setError("Failed to load trainer profile");
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime || !trainer) return;

    try {
      setBookingLoading(true);
      const dateString = selectedDate.toISOString().split("T")[0];

      await createBsooking({
        trainer: trainerId,
        session_type: "Personal Training",
        date: dateString,
        start_time: selectedTime,
        end_time: selectedEndTime,
        price: parseFloat(trainer.hourly_rate.toString()),
        notes: bookingNotes,
      });

      alert("Booking successful! The trainer will review your request.");
      setShowBookingModal(false);
      setBookingNotes("");
      // Refresh the calendar
      window.location.reload();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--primary)] mx-auto mb-4"></div>
            <div className="text-gray-600 text-lg font-medium">Loading trainer profile...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !trainer) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
            <div className="text-red-500 text-xl font-bold mb-4">{error || "Trainer not found"}</div>
            <p className="text-gray-600 mb-6">The trainer you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate("/find-trainers")}
              className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              Browse All Trainers
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Back Button */}
        <button
          onClick={() => navigate("/find-trainers")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] mb-8 font-medium transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Search Results</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Profile Picture */}
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-red-100 to-pink-100 ring-4 ring-white shadow-xl">
                    {trainer.profile_pic?.file ? (
                      <img
                        src={trainer.profile_pic.file}
                        alt={trainer.user_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        👤
                      </div>
                    )}
                  </div>
                  {/* Verified Badge */}
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg ring-4 ring-white">
                    <FaCheckCircle className="text-white text-lg" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
                    {trainer.user_name}
                  </h1>
                  <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 flex-wrap justify-center sm:justify-start">
                    <span className="inline-flex items-center gap-2 text-gray-700 font-semibold">
                      <FaBriefcase className="text-[var(--primary)]" />
                      {trainer.professional_title || "Certified Personal Trainer"}
                    </span>
                    <span className="hidden sm:inline text-gray-400">•</span>
                    <span className="inline-flex items-center gap-2 text-[var(--primary)] font-bold">
                      <FaAward />
                      {trainer.years_of_experience}+ years
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 font-medium mb-4 justify-center sm:justify-start">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span>{trainer.city}, {trainer.state}</span>
                  </div>

                  {/* Specializations */}
                  {trainer.specialisations && trainer.specialisations.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {trainer.specialisations.map((spec) => (
                        <span
                          key={spec.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-semibold border border-red-200"
                        >
                          {spec.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-6 mt-8 pt-6 border-t-2 border-gray-100">
                <div className="inline-flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                  <FaStar className="text-yellow-500 text-lg" />
                  <span className="text-xl font-bold text-gray-900">4.9</span>
                  <span className="text-gray-600 font-medium">(127 reviews)</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <FaComments className="text-[var(--primary)]" />
                </span>
                About {trainer.user_name.split(" ")[0]}
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                {trainer.bio || "No bio provided"}
              </p>
            </div>

            {/* Certifications */}
            {trainer.certifications && trainer.certifications.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <FaCertificate className="text-blue-600" />
                  </span>
                  Certifications & Credentials
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainer.certifications.map((cert, index) => (
                    <div 
                      key={cert.id || index} 
                      className="group border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FaCertificate className="text-blue-600 text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 mb-2 break-words">
                            {cert.file.split("/").pop()}
                          </p>
                          <a
                            href={cert.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                          >
                            View Certificate →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Training Videos */}
            {trainer.videos && trainer.videos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <FaPlay className="text-purple-600" />
                  </span>
                  Training Videos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainer.videos.map((video, index) => (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-56 flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                      <div className="relative z-10 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <FaPlay className="text-[var(--primary)] text-2xl ml-1" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">Training Session {index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Reviews */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <FaStar className="text-yellow-500" />
                </span>
                Client Reviews
              </h2>
              <div className="space-y-6">
                {/* Sample Reviews */}
                <div className="pb-6 border-b-2 border-gray-100 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      M
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900">Mike R.</span>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star} className="text-yellow-500 text-xs" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">2 days ago</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        "Sarah helped me lose 30 pounds in 6 months. Her personalized
                        approach and constant motivation made all the difference!"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pb-6 border-b-2 border-gray-100 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      J
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900">Jessica L.</span>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star} className="text-yellow-500 text-xs" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">1 week ago</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        "Professional, knowledgeable, and incredibly supportive. Sarah's
                        training sessions are challenging yet enjoyable."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                <div className="text-center mb-6 pb-6 border-b-2 border-gray-100">
                  <div className="text-sm font-semibold text-gray-500 mb-2">Starting at</div>
                  <div className="text-5xl font-extrabold text-[var(--primary)] mb-2">
                    ${trainer.hourly_rate}
                  </div>
                  <div className="text-sm font-medium text-gray-500">per session</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                      <FaClock className="text-[var(--primary)]" />
                      Response Time:
                    </span>
                    <span className="font-bold text-gray-900 text-sm">Within 2 hours</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                      <FaCalendarAlt className="text-[var(--primary)]" />
                      Availability:
                    </span>
                    <span className="font-bold text-gray-900 text-sm">Mon-Sat</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                      <FaMapMarkerAlt className="text-[var(--primary)]" />
                      Location:
                    </span>
                    <span className="font-bold text-gray-900 text-sm">In-person & Online</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        alert("Please log in to book a session");
                        navigate("/login");
                        return;
                      }
                      setShowBookingModal(true);
                    }}
                    className="w-full bg-[var(--primary)] text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Book Training Session
                  </button>

                </div>
              </div>

              {/* Booking Calendar */}
              <BookingCalendar
                trainerId={trainerId}
                trainerName={trainer.user_name}
                hourlyRate={trainer.hourly_rate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Confirm Booking</h2>

            <div className="space-y-4 mb-6 bg-gray-50 p-5 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Trainer:</span>
                <span className="font-bold text-gray-900">{trainer.user_name}</span>
              </div>
              {selectedDate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Date:</span>
                  <span className="font-bold text-gray-900">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Time:</span>
                <span className="font-bold text-gray-900">
                  {selectedTime} - {selectedEndTime}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                <span className="text-gray-600 font-medium">Price:</span>
                <span className="font-bold text-[var(--primary)] text-xl">${trainer.hourly_rate}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Notes (optional)
              </label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="Any special requests or goals for this session?"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100 transition-all h-24 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                disabled={bookingLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleBookSession}
                disabled={bookingLoading}
                className="flex-1 bg-[var(--primary)] text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TrainerDetailPage;
