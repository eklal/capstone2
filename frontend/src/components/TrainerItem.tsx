// src/components/TrainerItem.tsx
import React from "react";
import { FaStar } from "react-icons/fa";
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
    <div className="flex flex-col md:flex-row gap-4 p-4 border rounded bg-white hover:shadow-md transition-shadow">
      <div className="flex gap-4 items-start md:w-3/4">
        {/* Profile Picture */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {trainer.profile_pic?.file ? (
            <img
              src={trainer.profile_pic.file}
              alt={trainer.user_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              👤
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{trainer.user_name}</h3>
              <div className="text-sm text-gray-500">
                {trainer.professional_title || "Personal Trainer"} •{" "}
                {trainer.years_of_experience}+ yrs
              </div>
              {trainer.city && trainer.state && (
                <div className="text-sm text-gray-500 mt-1">
                  📍 {trainer.city}, {trainer.state}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">
                ${trainer.hourly_rate}/hr
              </div>
            </div>
          </div>

          {/* Bio */}
          {trainer.bio && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
              {trainer.bio}
            </p>
          )}

          {/* Specialties */}
          {trainer.specialisations && trainer.specialisations.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {trainer.specialisations.map((spec) => (
                <span
                  key={spec.id}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  {spec.name}
                </span>
              ))}
            </div>
          )}

          {/* Rating - Placeholder for now */}
          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              <FaStar />
              <span className="text-black font-semibold">4.9</span>
            </div>
            <span className="text-gray-500">(87 reviews)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 items-center md:flex-col md:justify-center md:w-1/4">
        <button
          onClick={handleViewProfile}
          className="flex-1 md:flex-none md:w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          View Profile
        </button>
        <button
          onClick={handleBookSession}
          className="flex-1 md:flex-none md:w-full px-4 py-2 rounded bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
        >
          Book Session
        </button>
      </div>
    </div>
  );
};

export default TrainerItem;
