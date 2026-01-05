import React from 'react';
import { FiSearch, FiCalendar, FiTarget } from 'react-icons/fi';

const HowItWorks: React.FC = () => {
  const steps = [
    { icon: <FiSearch size={40} />, title: 'Browse Trainers', text: 'Search and filter through hundreds of certified trainers.' },
    { icon: <FiCalendar size={40} />, title: 'Book Sessions', text: 'Schedule training sessions at your convenience.' },
    { icon: <FiTarget size={40} />, title: 'Achieve Goals', text: 'Work with your trainer to reach your fitness goals.' }
  ];

  return (
    <section className="py-16 bg-white text-center">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-[var(--primary)]">How It Works</h2>
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-12">
          {steps.map((s) => (
            <div key={s.title} className="w-full md:w-1/3">
              <div className="flex justify-center text-[var(--primary)]">{s.icon}</div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;