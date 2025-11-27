import React from 'react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-black text-white text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold">Ready to Start your Fitness Journey?</h2>
        <p className="mt-2 text-gray-300">Join thousands of people who have transformed their lives with professional training</p>

        <div className="mt-6 flex justify-center gap-6">
          <Link to="/find-trainers" className="px-6 py-3 bg-gray-700 rounded text-white">Find a Trainer</Link>
          <Link to="/register/trainer" className="px-6 py-3 bg-[var(--primary)] rounded text-white">Become a Trainer</Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;