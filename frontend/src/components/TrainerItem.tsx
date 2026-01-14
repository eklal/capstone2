// src/components/TrainerItem.tsx
import React from "react";
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { TrainerProfile } from "@/api/trainers";

interface TrainerItemProps {
  trainer: TrainerProfile;
  onView?: (id: number) => void;
  onBook?: (id: number) => void;
}

const TrainerItem: React.FC<TrainerItemProps> = ({ trainer, onView, onBook }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (onView) {
      onView(trainer.id);
    } else {
      navigate(`/trainer/${trainer.id}`);
    }
  };

  const handleBookSession = () => {
    if (onBook) {
      onBook(trainer.id);
    } else {
      navigate(`/trainer/${trainer.id}?action=book`);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Left Section - Profile Info */}
        <div className="flex gap-5 items-start flex-1">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-red-100 to-pink-100 flex-shrink-0 ring-4 ring-white shadow-lg">
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
            {/* Verified Badge */}
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg">
              <FaCheckCircle className="text-white text-sm" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name & Title */}
            <div className="mb-3">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                {trainer.user_name}
              </h3>
              <div className="flex items-center gap-3 flex-wrap text-sm">
                <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                  <FaBriefcase className="text-gray-500" />
                  {trainer.professional_title || "Personal Trainer"}
                </span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-gray-500">{trainer.years_of_experience}+ years exp</span>
              </div>
              {trainer.city && trainer.state && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-2">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <span className="font-medium">{trainer.city}, {trainer.state}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {trainer.bio && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                {trainer.bio}
              </p>
            )}

            {/* Specialties */}
            {trainer.specialisations && trainer.specialisations.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {trainer.specialisations.slice(0, 4).map((spec) => (
                  <span
                    key={spec.id}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200"
                  >
                    {spec.name}
                  </span>
                ))}
                {trainer.specialisations.length > 4 && (
                  <span className="text-xs font-semibold text-gray-500 px-3 py-1.5">
                    +{trainer.specialisations.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                <FaStar className="text-yellow-500 text-sm" />
                <span className="text-sm font-bold text-gray-900">4.9</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">(87 reviews)</span>
            </div>
          </div>
        </div>

        {/* Right Section - Price & Actions */}
        <div className="flex lg:flex-col items-center justify-between lg:justify-start gap-4 lg:w-52 pt-4 lg:pt-0 border-t-2 lg:border-t-0 lg:border-l-2 border-gray-100 lg:pl-6">
          {/* Price */}
          <div className="lg:text-center">
            <div className="text-sm font-semibold text-gray-500 mb-1">Starting at</div>
            <div className="text-3xl font-extrabold text-[var(--primary)]">
              ${trainer.hourly_rate}
            </div>
            <div className="text-sm font-medium text-gray-500">per session</div>
          </div>

          {/* Action Buttons */}
          <div className="flex lg:flex-col gap-3 w-full">
            <button
              onClick={handleViewProfile}
              className="flex-1 lg:w-full px-5 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:border-[var(--primary)] hover:bg-red-50 hover:text-[var(--primary)] transition-all duration-200"
            >
              View Profile
            </button>
            <button
              onClick={handleBookSession}
              className="flex-1 lg:w-full px-5 py-3 rounded-xl font-bold text-white bg-[var(--primary)] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerItem;
