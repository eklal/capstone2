// src/components/FiltersPanel.tsx
import React, { useEffect, useState } from "react";

export type FiltersState = {
  location?: string;
  specialties: string[];
  priceRange?: string;
  experience?: string;
};

const SPECIALTIES = ["Weight Training","Cardio","Yoga","CrossFit","Nutrition","Pilates","HIIT"];

export default function FiltersPanel({
  value,
  onChange,
  onApply,
  onClose, // optional: used in mobile drawer to close without applying
  hideClose = false,
}: {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  onApply: () => void;
  onClose?: ()=>void;
  hideClose?: boolean;
}) {
  const [state, setState] = useState<FiltersState>(value);

  useEffect(() => setState(value), [value]);

  const toggle = (s:string) => {
    setState(prev => {
      const exists = prev.specialties.includes(s);
      return { ...prev, specialties: exists ? prev.specialties.filter(x=>x!==s) : [...prev.specialties, s] };
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      {!hideClose && onClose && (
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl">✕</button>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1">Location</label>
        <input value={state.location || ""} onChange={(e)=>setState({...state, location:e.target.value})} className="w-full border px-3 py-2 rounded" placeholder="Enter city or zip code" />
      </div>

      <div className="mt-4">
        <div className="font-semibold mb-2">Specialties</div>
        <div className="grid grid-cols-2 gap-2">
          {SPECIALTIES.map(s => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={state.specialties.includes(s)} onChange={()=>toggle(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="font-semibold mb-2">Price Range</div>
        <label className="flex items-center gap-2 text-sm"><input type="radio" name="price" checked={state.priceRange==="$30-$50"} onChange={()=>setState({...state, priceRange:"$30-$50"})} /> $30-$50/hour</label>
        <label className="flex items-center gap-2 text-sm"><input type="radio" name="price" checked={state.priceRange==="$50-$80"} onChange={()=>setState({...state, priceRange:"$50-$80"})} /> $50-$80/hour</label>
        <label className="flex items-center gap-2 text-sm"><input type="radio" name="price" checked={state.priceRange==="$80+"} onChange={()=>setState({...state, priceRange:"$80+"})} /> $80+/hour</label>
      </div>

      <div className="mt-4">
        <div className="font-semibold mb-2">Experience</div>
        <label className="flex items-center gap-2 text-sm"><input type="radio" name="exp" checked={state.experience==="1-3"} onChange={()=>setState({...state, experience:"1-3"})} /> 1-3 years</label>
        <label className="flex items-center gap-2 text-sm"><input type="radio" name="exp" checked={state.experience==="3-5"} onChange={()=>setState({...state, experience:"3-5"})} /> 3-5 years</label>
        <label className="flex items-center gap-2 text-sm"><input type="radio" name="exp" checked={state.experience==="5+"} onChange={()=>setState({...state, experience:"5+"})} /> 5+ years</label>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="bg-[var(--primary)] text-white px-4 py-2 rounded" onClick={()=>{
          onChange(state);
          onApply();
        }}>Apply Filters</button>

        <button className="px-4 py-2 border rounded" onClick={()=>{
          const cleared = { location: "", specialties: [], priceRange: undefined, experience: undefined };
          setState(cleared);
          onChange(cleared);
        }}>Clear</button>
      </div>
    </div>
  );
}
