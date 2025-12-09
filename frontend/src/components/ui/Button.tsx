import React from "react";

type Variant = "primary" | "secondary" | "outline";

const classes: Record<Variant, string> = {
  primary: "bg-[var(--primary)] text-white hover:opacity-90",
  secondary: "bg-black text-white hover:opacity-90",
  outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
};

const Button: React.FC<{
  children: React.ReactNode;
  variant?: Variant;
  onClick?: () => void;
  className?: string;
}> = ({ children, variant = "primary", onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium ${classes[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
