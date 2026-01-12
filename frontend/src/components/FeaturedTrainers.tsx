import React, { useEffect, useState } from 'react';
import { getFeaturedTrainers } from '@/api/trainers';
import type { TrainerProfile } from '@/api/trainers';
import TrainerCard from './TrainerCard';

const FeaturedTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedTrainers = async () => {
      try {
        setLoading(true);
        const data = await getFeaturedTrainers();
        setTrainers(data);
      } catch (err) {
        console.error('Error loading featured trainers:', err);
        setError('Failed to load featured trainers');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedTrainers();
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl text-center font-bold text-[var(--primary)]">Featured Trainers</h2>
        <p className="text-center text-gray-600 mt-2">Top-rated fitness professionals ready to help you</p>

        {loading ? (
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="bg-white shadow rounded-xl w-80 h-96 animate-pulse"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="mt-4 h-40 bg-gray-300 rounded-lg"></div>
                  <div className="mt-3 space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 text-center text-red-500">
            {error}
          </div>
        ) : trainers.length > 0 ? (
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {trainers.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center text-gray-500">
            No featured trainers available at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTrainers;
