import React from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import {
  FiHome,
  FiCalendar,
  FiHeart,
  FiCreditCard,
  FiUser,
  FiSettings,
} from "react-icons/fi";

interface ClientPageContainerProps {
  children: React.ReactNode;
}

const ClientPageContainer: React.FC<ClientPageContainerProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/client-dashboard",
      icon: <FiHome className="text-xl" />,
    },
    {
      name: "My Bookings",
      path: "/my-bookings",
      icon: <FiCalendar className="text-xl" />,
    },
    {
      name: "Favorites",
      path: "/favorites",
      icon: <FiHeart className="text-xl" />,
    },
    {
      name: "Payment Methods",
      path: "/payment-methods",
      icon: <FiCreditCard className="text-xl" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FiUser className="text-xl" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FiSettings className="text-xl" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex pt-20">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed left-0 top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="p-6">
            {/* User Info */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user?.username}</h3>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                      ${
                        isActive
                          ? "bg-[var(--primary)] text-white shadow-lg shadow-red-500/30"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <span className={isActive ? "text-white" : "text-gray-500"}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around items-center h-16">
          {navigationItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center gap-1 flex-1 h-full
                  ${isActive ? "text-[var(--primary)]" : "text-gray-500"}
                `}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <Footer />
    </div>
  );
};

export default ClientPageContainer;
