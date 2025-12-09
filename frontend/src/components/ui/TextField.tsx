import React from "react";

export const TextField: React.FC<{
  label?: string;
  value?: string;
  onChange?: (v:string)=>void;
  placeholder?: string;
  type?: string;
  className?: string;
  textarea?: boolean;
}> = ({ label, value, onChange, placeholder, type = "text", className = "", textarea = false }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-sm text-gray-600 mb-2">{label}</label>}
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange?.(e.target.value)}
          rows={5}
          className="w-full border rounded-md px-3 py-2 text-sm placeholder-gray-400"
          placeholder={placeholder}
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange?.(e.target.value)}
          type={type}
          className="w-full border rounded-md px-3 py-2 text-sm placeholder-gray-400"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};
