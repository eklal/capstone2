import React from "react";

interface Props {
  mode: "signin" | "signup";
  setMode: (m: "signin" | "signup") => void;
}

const AuthToggle: React.FC<Props> = ({ mode, setMode }) => {
  return (
    <div className="relative flex w-full max-w-xs bg-gray-200 rounded-full p-1 cursor-pointer">
      {/* Slider */}
      <div
        className="absolute w-1/2 h-full  bg-[var(--primary)] rounded-full transition-all duration-500"
        style={{ left: mode === "signin" ? "0%" : "50%" }}
      />

      {/* Buttons */}
      <div className="relative flex w-full text-sm font-medium text-center">
        <button
          className={`w-1/2 py-2 z-10 ${mode === "signin" ? "text-white" : "text-gray-600"}`}
          onClick={() => setMode("signin")}
        >
          Sign In
        </button>

        <button
          className={`w-1/2 py-2 z-10 ${mode === "signup" ? "text-white" : "text-gray-600"}`}
          onClick={() => setMode("signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default AuthToggle;
