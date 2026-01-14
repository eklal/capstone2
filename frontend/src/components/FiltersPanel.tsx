// src/components/FiltersPanel.tsx
import React, { useEffect, useState } from "react";
import { getSpecialisations, type Specialisation } from "@/api/trainers";
import { FiMapPin, FiTag, FiDollarSign, FiAward, FiCheck } from "react-icons/fi";

export type FiltersState = {
  location?: string;
  specialties: string[];
  priceRange?: string;
  experience?: string;
};

export default function FiltersPanel({
  value,
  onChange,
  onApply,
  onClose, // optional: used in mobile drawer to close without applying
  hideClose = false,
}: {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  onApply: (filters: FiltersState) => void;
  onClose?: ()=>void;
  hideClose?: boolean;
}) {
  const [state, setState] = useState<FiltersState>(value);
  const [specialties, setSpecialties] = useState<Specialisation[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);

  useEffect(() => setState(value), [value]);

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const data = await getSpecialisations();
        setSpecialties(data);
      } catch (error) {
        console.error("Error loading specialties:", error);
        // Fallback to hardcoded list if API fails
        setSpecialties([
          { id: 1, name: "Weight Training" },
          { id: 2, name: "Cardio" },
          { id: 3, name: "Yoga" },
          { id: 4, name: "CrossFit" },
          { id: 5, name: "Nutrition" },
          { id: 6, name: "Pilates" },
          { id: 7, name: "HIIT" },
        ]);
      } finally {
        setLoadingSpecialties(false);
      }
    };
    loadSpecialties();
  }, []);

  const toggle = (s:string) => {
    setState(prev => {
      const exists = prev.specialties.includes(s);
      return { ...prev, specialties: exists ? prev.specialties.filter(x=>x!==s) : [...prev.specialties, s] };
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--primary)] px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Filters</h3>
          {!hideClose && onClose && (
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <FiMapPin className="text-[var(--primary)]" />
            <span>Location</span>
          </label>
          <div className="relative">
            <input 
              value={state.location || ""} 
              onChange={(e)=>setState({...state, location:e.target.value})} 
              className="w-full border-2 border-gray-200 pl-4 pr-4 py-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100 transition-all text-sm font-medium"
              placeholder="Enter city or state" 
            />
          </div>
        </div>

        {/* Specialties - Vertical Layout */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <FiTag className="text-[var(--primary)]" />
            <span>Specialties</span>
          </label>
          {loadingSpecialties ? (
            <div className="text-sm text-gray-500 py-2">Loading specialties...</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {specialties.map(s => (
                <label 
                  key={s.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    state.specialties.includes(s.name) 
                      ? 'border-[var(--primary)] bg-red-50' 
                      : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    state.specialties.includes(s.name)
                      ? 'border-[var(--primary)] bg-[var(--primary)]'
                      : 'border-gray-300'
                  }`}>
                    {state.specialties.includes(s.name) && (
                      <FiCheck className="text-white text-sm" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    state.specialties.includes(s.name) ? 'text-red-900' : 'text-gray-700'
                  }`}>
                    {s.name}
                  </span>
                  <input 
                    type="checkbox" 
                    checked={state.specialties.includes(s.name)} 
                    onChange={() => toggle(s.name)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <FiDollarSign className="text-[var(--primary)]" />
            <span>Price Range</span>
          </label>
          <div className="space-y-2">
            {[
              { value: "$30-$50", label: "$30-$50/session" },
              { value: "$50-$80", label: "$50-$80/session" },
              { value: "$80+", label: "$80+/session" }
            ].map(option => (
              <label 
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  state.priceRange === option.value
                    ? 'border-[var(--primary)] bg-red-50'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  state.priceRange === option.value
                    ? 'border-[var(--primary)]'
                    : 'border-gray-300'
                }`}>
                  {state.priceRange === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]"></div>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  state.priceRange === option.value ? 'text-red-900' : 'text-gray-700'
                }`}>
                  {option.label}
                </span>
                <input 
                  type="radio" 
                  name="price" 
                  checked={state.priceRange === option.value} 
                  onChange={()=>setState({...state, priceRange: option.value})}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <FiAward className="text-[var(--primary)]" />
            <span>Experience</span>
          </label>
          <div className="space-y-2">
            {[
              { value: "1-3", label: "1-3 years" },
              { value: "3-5", label: "3-5 years" },
              { value: "5+", label: "5+ years" }
            ].map(option => (
              <label 
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  state.experience === option.value
                    ? 'border-[var(--primary)] bg-red-50'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  state.experience === option.value
                    ? 'border-[var(--primary)]'
                    : 'border-gray-300'
                }`}>
                  {state.experience === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]"></div>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  state.experience === option.value ? 'text-red-900' : 'text-gray-700'
                }`}>
                  {option.label}
                </span>
                <input 
                  type="radio" 
                  name="exp" 
                  checked={state.experience === option.value} 
                  onChange={()=>setState({...state, experience: option.value})}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <button 
            className="w-full bg-[var(--primary)] text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all" 
            onClick={() => {
              onChange(state);
              onApply(state);
            }}
          >
            Apply Filters
          </button>

          <button 
            className="w-full px-6 py-3.5 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all" 
            onClick={() => {
              const cleared = { location: "", specialties: [], priceRange: undefined, experience: undefined };
              setState(cleared);
              onChange(cleared);
              onApply(cleared);
            }}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
