import React from "react";
import { Link } from "react-router-dom";

const TrainerNavbar: React.FC = () => {
  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-black flex items-center justify-center text-white">
                🏋️
              </div>
              <span className="text-lg font-semibold">TrainerHub</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              🔔
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TrainerNavbar;
