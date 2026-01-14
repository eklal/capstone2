import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiTag, FiDollarSign } from 'react-icons/fi';
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="text-center mb-10 max-w-3xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
          Find Your <span className="text-[var(--primary)]">Perfect Trainer</span>
        </h2>
        <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed">
          Search by location, specialty, or price range to discover expert fitness professionals
        </p>
      </div>

      <div className="w-full max-w-6xl">
        <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Location Input */}
            <div className="relative group">
              <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">
                Location
              </label>
              <div className="absolute left-4 top-[42px] text-gray-400 group-focus-within:text-[var(--primary)] transition-colors duration-200">
                <FiMapPin className="text-xl" />
              </div>
              <input
                type="text"
                placeholder="Enter City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-200 text-base font-medium text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:bg-white hover:border-gray-300"
              />
            </div>

            {/* Specialty Dropdown */}
            <div className="relative group">
              <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">
                Specialty
              </label>
              <div className="absolute left-4 top-[42px] text-gray-400 group-focus-within:text-[var(--primary)] transition-colors duration-200 pointer-events-none z-10">
                <FiTag className="text-xl" />
              </div>
              <select 
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-200 text-base font-medium text-gray-800 appearance-none cursor-pointer bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-gray-300"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em',
                }}
                disabled={loading}
              >
                <option value="">All Specialties</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.name}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Dropdown */}
            <div className="relative group">
              <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">
                Price Range
              </label>
              <div className="absolute left-4 top-[42px] text-gray-400 group-focus-within:text-[var(--primary)] transition-colors duration-200 pointer-events-none z-10">
                <FiDollarSign className="text-xl" />
              </div>
              <select 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-200 text-base font-medium text-gray-800 appearance-none cursor-pointer bg-gray-50 focus:bg-white hover:border-gray-300"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em',
                }}
              >
                <option value="">Any Price</option>
                <option value="$30-$50">$30-$50/hour</option>
                <option value="$50-$80">$50-$80/hour</option>
                <option value="$80+">$80+/hour</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="relative group lg:self-end">
              <label className="block text-xs font-semibold text-transparent mb-2 ml-1 select-none">
                Search
              </label>
              <button 
                onClick={handleSearch}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--primary)] to-red-700 px-8 py-4 text-white rounded-2xl font-bold hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-base lg:text-lg group-hover:from-red-700 group-hover:to-[var(--primary)]"
              >
                <FiSearch className="text-xl" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Helper Text */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <span className="text-lg">💡</span>
              <span className="font-medium">Tip: Leave fields empty to browse all trainers</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchTrainer;