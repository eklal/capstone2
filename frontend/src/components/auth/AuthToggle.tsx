import React from "react";

interface Props {
  mode: "signin" | "signup";
  setMode: (m: "signin" | "signup") => void;
}

const AuthToggle: React.FC<Props> = ({ mode, setMode }) => {
  return (
    <div className="relative flex w-full max-w-sm bg-gray-100 rounded-xl p-1.5 cursor-pointer shadow-inner mx-auto">
      {/* Slider */}
      <div
        className="absolute w-1/2 h-[calc(100%-0.75rem)] bg-[var(--primary)] rounded-lg transition-all duration-300 ease-out shadow-lg"
        style={{ left: mode === "signin" ? "0.375rem" : "calc(50% - 0.375rem)" }}
      />

      {/* Buttons */}
      <div className="relative flex w-full text-sm font-bold text-center">
        <button
          className={`w-1/2 py-3 z-10 transition-colors duration-300 ${mode === "signin" ? "text-white" : "text-gray-600"}`}
          onClick={() => setMode("signin")}
        >
          Sign In
        </button>

        <button
          className={`w-1/2 py-3 z-10 transition-colors duration-300 ${mode === "signup" ? "text-white" : "text-gray-600"}`}
          onClick={() => setMode("signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default AuthToggle;
