import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const TrainerNavbar: React.FC = () => {
  const { user, logout } = useAuth();

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
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <span className="text-sm font-medium hidden sm:block">{user?.username}</span>
              </div>
              
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TrainerNavbar;
