import React from "react";

interface InputFieldProps {
  label?: string;
  type?: string;
  placeholder: string;
  icon?: React.ReactNode;
  error?: string;
  register: any;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  placeholder,
  icon,
  error,
  register,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-sm">
        <input
          type={type}
          placeholder={placeholder}
          {...register}
          className="w-full bg-transparent outline-none text-black"
        />
        {icon && <span className="text-gray-500 ml-2">{icon}</span>}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
