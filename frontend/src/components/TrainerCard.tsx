import React from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TrainerCard: React.FC<{ trainer: any }> = ({ trainer }) => {
  return (
    <div className="bg-white shadow rounded-xl w-80 p-4">
      <div className="flex items-center gap-3">
        <img src={trainer.thumbnail} alt={trainer.name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h3 className="font-bold">{trainer.name}</h3>
          <p className="text-gray-500 text-sm">{trainer.title}</p>
        </div>
      </div>

      <div className="mt-4">
        <img src={trainer.thumbnail} alt="thumb" className="rounded-lg h-40 w-full object-cover" />
      </div>

      <p className="text-gray-600 mt-3 text-sm">{trainer.description}</p>

      <div className="mt-3 flex gap-2 flex-wrap">
        {trainer.tags.map((t: string) => (
          <span key={t} className="px-2 py-1 bg-gray-200 rounded-full text-xs text-gray-700">{t}</span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-yellow-500">
          <FaStar />
          <span className="text-black font-semibold">{trainer.rating}</span>
          <span className="text-gray-500 text-sm">({trainer.reviews})</span>
        </div>

        <p className="font-semibold">{trainer.price}</p>
      </div>

      <Link to={`/trainer/${trainer.id}`} className="mt-4 block">
        <button className="w-full bg-[var(--primary)] text-white rounded py-2">View Profile</button>
      </Link>
    </div>
  );
};

export default TrainerCard;