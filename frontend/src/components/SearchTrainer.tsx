import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchTrainer: React.FC = () => {
  return (
    <section className="py-12 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center text-[var(--primary)]">Find Your Ideal Trainer</h2>
      <p className="text-gray-600 mt-1">Search by location, specialty or training style</p>

      <div className="mt-6 bg-white shadow-md rounded-lg p-6 flex gap-4 w-full max-w-3xl">
        <input
          type="text"
          placeholder="Enter City"
          className="w-full border px-3 py-2 rounded"
        />

        <select className="border px-3 py-2 rounded w-1/4">
          <option>All Specialties</option>
          <option>Strength Training</option>
          <option>Weight Loss</option>
        </select>

        <select className="border px-3 py-2 rounded w-1/4">
          <option>Any Price</option>
          <option>$10 - $20</option>
        </select>

        <button className="flex items-center justify-center bg-[var(--primary)] px-4 text-white rounded">
          <FiSearch />
        </button>
      </div>
    </section>
  );
};

export default SearchTrainer;