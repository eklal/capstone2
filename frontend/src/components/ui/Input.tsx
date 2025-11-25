import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; // <-- allow error message
}

const Input: React.FC<Props> = ({ label, error, ...rest }) => {
  return (
    <div className="mb-4">
      <label className="text-sm text-gray-600">{label}</label>

      <input
        {...rest}  // <-- this lets register() work
        className={`w-full border rounded-md px-3 py-2 mt-1 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
