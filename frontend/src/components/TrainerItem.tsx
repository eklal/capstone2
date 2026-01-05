// src/components/TrainerItem.tsx
import React from "react";
import { FaStar } from "react-icons/fa";

const TrainerItem: React.FC<{ trainer: any; onView?: (id:number)=>void; onBook?: (id:number)=>void }> = ({ trainer }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 border rounded bg-white">
      <div className="flex gap-4 items-start md:w-3/4">
        <img src={trainer.thumbnail} alt={trainer.name} className="w-24 h-24 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{trainer.name}</h3>
              <div className="text-sm text-gray-500">{trainer.title} • {trainer.experienceYears} yrs</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">${trainer.price}/hr</div>
            </div>
          </div>

          <p className="text-sm text-gray-700 mt-2">{trainer.description}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {trainer.specialties.map((s:string) => (
              <span key={s} className="text-xs bg-gray-100 px-2 py-1 rounded">{s}</span>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-yellow-500">
            <FaStar /><span className="text-black font-semibold">{trainer.rating}</span>
            <span className="text-gray-500">({trainer.reviews})</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-center md:flex-col md:justify-center md:w-1/4">
        <button className="px-4 py-2 border rounded">View Profile</button>
        <button className="px-4 py-2 rounded bg-[var(--primary)] text-white">Book Session</button>
      </div>
    </div>
  );
};

export default TrainerItem;
