import React from "react";

interface ButtonProps {
  text: string;
  type?: "button" | "submit";
  onClick?: () => void;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "danger" | "outline";
  className?: string; 
}

const Button: React.FC<ButtonProps> = ({
  text,
  type = "button",
  onClick,
  loading = false,
  fullWidth = true,
  variant = "primary",
  className = "",
}) => {
  const base =
    "px-4 py-3 font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed";

  const colors = {
    primary: "bg-teal-500 hover:bg-teal-600 text-white",
    secondary: "bg-orange-500 hover:bg-orange-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline:
      "border border-white text-white hover:bg-white hover:text-black transition",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${base} ${colors[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {loading ? "Please wait..." : text}
    </button>
  );
};

export default Button;
