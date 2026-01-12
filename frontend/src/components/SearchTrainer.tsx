import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { getSpecialisations, type Specialisation } from '@/api/trainers';

const SearchTrainer: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [specialties, setSpecialties] = useState<Specialisation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const data = await getSpecialisations();
        setSpecialties(data);
      } catch (error) {
        console.error("Error loading specialties:", error);
        // Fallback to some defaults if API fails
        setSpecialties([
          { id: 1, name: "Weight Training" },
          { id: 2, name: "Cardio" },
          { id: 3, name: "Yoga" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadSpecialties();
  }, []);

  const handleSearch = () => {
    // Build URL params for the trainers list page
    const params = new URLSearchParams();
    
    if (location.trim()) {
      params.set('location', location.trim());
    }
    
    if (specialty) {
      params.set('specialties', specialty);
    }
    
    if (priceRange) {
      params.set('priceRange', priceRange);
    }
    
    // Navigate to trainers list with search params
    const searchQuery = params.toString();
    navigate(`/find-trainers${searchQuery ? `?${searchQuery}` : ''}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="py-12 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center text-[var(--primary)]">Find Your Ideal Trainer</h2>
      <p className="text-gray-600 mt-1">Search by location, specialty or training style</p>

      <div className="mt-6 bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-4 w-full max-w-3xl">
        <input
          type="text"
          placeholder="Enter City"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />

        <select 
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          disabled={loading}
        >
          <option value="">All Specialties</option>
          {specialties.map((spec) => (
            <option key={spec.id} value={spec.name}>
              {spec.name}
            </option>
          ))}
        </select>

        <select 
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="">Any Price</option>
          <option value="$30-$50">$30-$50/hour</option>
          <option value="$50-$80">$50-$80/hour</option>
          <option value="$80+">$80+/hour</option>
        </select>

        <button 
          onClick={handleSearch}
          className="flex items-center justify-center bg-[var(--primary)] px-6 py-2 text-white rounded hover:opacity-90 transition-opacity"
        >
          <FiSearch className="mr-2" />
          <span className="hidden md:inline">Search</span>
        </button>
      </div>
    </section>
  );
};

export default SearchTrainer;