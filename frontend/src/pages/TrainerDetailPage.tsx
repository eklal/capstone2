import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrainerProfile } from "@/api/trainers";
import { createBooking } from "@/api/bookings";
import type { TrainerProfile } from "@/api/trainers";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

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

  const handleSlotSelect = (date: Date, startTime: string, endTime: string) => {
    if (!isLoggedIn) {
      alert("Please log in to book a session");
      navigate("/login");
      return;
    }
    setSelectedDate(date);
    setSelectedTime(startTime);
    setSelectedEndTime(endTime);
    setShowBookingModal(true);
  };

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime || !trainer) return;

    try {
      setBookingLoading(true);
      const dateString = selectedDate.toISOString().split("T")[0];

      await createBooking({
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500 text-lg">Loading trainer profile...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !trainer) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">{error || "Trainer not found"}</div>
            <button
              onClick={() => navigate("/find-trainers")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Back to Trainers
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        {/* Back Button */}
        <button
          onClick={() => navigate("/find-trainers")}
          className="text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-2"
        >
          ← Back to Search Results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-6">
                {/* Profile Picture */}
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {trainer.profile_pic?.file ? (
                    <img
                      src={trainer.profile_pic.file}
                      alt={trainer.user_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      👤
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{trainer.user_name}</h1>
                  <p className="text-gray-600 text-lg mb-2">
                    {trainer.professional_title || "Certified Personal Trainer"}
                  </p>
                  <p className="text-gray-500 mb-3">
                    {trainer.years_of_experience}+ years experience
                  </p>
                  <p className="text-gray-600 mb-4">
                    📍 {trainer.city}, {trainer.state}
                  </p>

                  {/* Specializations */}
                  {trainer.specialisations && trainer.specialisations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {trainer.specialisations.map((spec) => (
                        <span
                          key={spec.id}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {spec.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-yellow-500">
                  <span className="text-2xl">★★★★★</span>
                  <span className="text-black font-semibold">4.9</span>
                  <span className="text-gray-500">(127 reviews)</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">About {trainer.user_name.split(" ")[0]}</h2>
              <p className="text-gray-700 leading-relaxed">
                {trainer.bio || "No bio provided"}
              </p>
            </div>
            {/* Certifications */}
            {trainer.certifications && trainer.certifications.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Certifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainer.certifications.map((cert, index) => (
                    <div key={cert.id || index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🎓</div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm break-all">
                            {cert.file.split("/").pop()}
                          </p>
                          <a
                            href={cert.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                          >
                            View Certificate
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
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Training Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainer.videos.map((video, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 rounded-lg h-48 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">▶️</div>
                        <p className="text-sm text-gray-600">Video {index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Reviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Client Reviews</h2>
              <div className="space-y-4">
                {/* Sample Reviews */}
                <div className="border-b pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      M
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">Mike R.</span>
                        <span className="text-yellow-500">★★★★★</span>
                        <span className="text-sm text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        "Sarah helped me lose 30 pounds in 6 months. Her personalized
                        approach and constant motivation made all the difference!"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      J
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">Jessica L.</span>
                        <span className="text-yellow-500">★★★★★</span>
                        <span className="text-sm text-gray-500">1 week ago</span>
                      </div>
                      <p className="text-gray-700 text-sm">
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
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-gray-900">
                    ${trainer.hourly_rate}
                  </div>
                  <div className="text-gray-500">/hour</div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-medium">Within 2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-medium">Mon-Sat</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">In-person & Online</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      alert("Please log in to book a session");
                      navigate("/login");
                      return;
                    }
                    setShowBookingModal(true);
                  }}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Book Training Session
                </button>

                <button
                  className="w-full border border-gray-300 py-3 rounded-lg font-semibold mt-3 hover:bg-gray-50 transition-colors"
                >
                  Send Message
                </button>
              </div>

              {/* Availability Calendar */}
              <AvailabilityCalendar
                trainerId={trainerId}
                onSelectSlot={handleSlotSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Trainer:</span>
                <span className="font-medium">{trainer.user_name}</span>
              </div>
              {selectedDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {selectedTime} - {selectedEndTime}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">${trainer.hourly_rate}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="Any special requests or goals for this session?"
                className="w-full px-3 py-2 border rounded-md h-24"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-50"
                disabled={bookingLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleBookSession}
                disabled={bookingLoading}
                className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
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
