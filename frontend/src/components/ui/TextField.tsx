import React from "react";

export const TextField: React.FC<{
  label?: string;
  value?: string;
  onChange?: (v:string)=>void;
  placeholder?: string;
  type?: string;
  className?: string;
  textarea?: boolean;
  disabled?: boolean;
}> = ({ label, value, onChange, placeholder, type = "text", className = "", textarea = false, disabled = false }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-sm text-gray-600 mb-2">{label}</label>}
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange?.(e.target.value)}
          rows={5}
          disabled={disabled}
          className={`w-full border rounded-md px-3 py-2 text-sm placeholder-gray-400 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange?.(e.target.value)}
          type={type}
          disabled={disabled}
          className={`w-full border rounded-md px-3 py-2 text-sm placeholder-gray-400 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};
