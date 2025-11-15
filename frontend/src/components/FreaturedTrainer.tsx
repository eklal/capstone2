import React, { useEffect, useState } from 'react';
import TrainerCard from './TrainerCard';

const FeaturedTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<any[]>([]);

  useEffect(() => {
    // Replace this with your real API call later:
    // fetch('/api/trainers').then(r => r.json()).then(setTrainers)

    // For now we import the dummy JSON file inside data
    import('../data/trainer.json').then((module) => {
      setTrainers(module.default || module);
    });
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl text-center font-bold text-[var(--primary)]">Featured Trainers</h2>
        <p className="text-center text-gray-600">Top-rated fitness professionals in your area</p>

        <div className="mt-10 flex flex-wrap justify-center gap-8">
          {trainers.map((t) => (
            <TrainerCard key={t.id} trainer={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTrainers;
