import React from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import type { TrainerProfile } from '@/api/trainers';

interface TrainerCardProps {
  trainer: TrainerProfile;
}

const TrainerCard: React.FC<TrainerCardProps> = ({ trainer }) => {
  // Get first specialisation or default text
  const bio = trainer.bio || 'Experienced fitness professional dedicated to helping you achieve your goals.';
  const displayBio = bio.length > 100 ? bio.substring(0, 100) + '...' : bio;

  return (
    <div className="bg-white shadow-lg rounded-xl w-80 p-4 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {trainer.profile_pic?.file ? (
            <img 
              src={trainer.profile_pic.file} 
              alt={trainer.user_name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              👤
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold">{trainer.user_name}</h3>
          <p className="text-gray-500 text-sm">
            {trainer.professional_title || 'Personal Trainer'}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="rounded-lg h-40 w-full overflow-hidden bg-gray-200">
          {trainer.profile_pic?.file ? (
            <img 
              src={trainer.profile_pic.file} 
              alt={trainer.user_name}
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🏋️
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 mt-3 text-sm line-clamp-3">
        {displayBio}
      </p>

      <div className="mt-3 flex gap-2 flex-wrap">
        {trainer.specialisations?.slice(0, 2).map((spec) => (
          <span 
            key={spec.id} 
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
          >
            {spec.name}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-yellow-500">
          <FaStar />
          <span className="text-black font-semibold">4.9</span>
          <span className="text-gray-500 text-sm">(127)</span>
        </div>

        <p className="font-semibold text-lg">${trainer.hourly_rate}/hr</p>
      </div>

      <Link to={`/trainer/${trainer.id}`} className="mt-4 block">
        <button className="w-full bg-[var(--primary)] text-white rounded py-2 hover:opacity-90 transition-opacity">
          View Profile
        </button>
      </Link>
    </div>
  );
};

export default TrainerCard;