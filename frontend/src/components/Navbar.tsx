import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FaDumbbell, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, isLoggedIn, logout } = useAuth();

    const closeMenu = () => setIsOpen(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Disable body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Get dashboard route based on user role
    const getDashboardRoute = () => {
        if (user?.role === "trainer" && user?.id) {
            return `/trainer-dashboard/${user.id}`;
        } else if (user?.role === "client") {
            return "/client-dashboard";
        }
        return "/";
    };

    return (
        <>
        <nav className={`w-full fixed top-0 left-0 z-40 transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
                : 'bg-white/90 backdrop-blur-md shadow-md'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="group flex items-center gap-3 transition-transform hover:scale-105">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                        <FaDumbbell className="text-white text-xl" />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="font-bold text-xl text-gray-900 tracking-tight">Boutique</span>
                        <span className="font-black text-xl text-[var(--primary)] tracking-tight">Fitness</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    {!isLoggedIn ? (
                        <>
                            <Link 
                                to="/find-trainers" 
                                className="text-gray-700 font-semibold text-base hover:text-[var(--primary)] transition-colors relative group"
                            >
                                Find Trainers
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link 
                                to="/how-it-works" 
                                className="text-gray-700 font-semibold text-base hover:text-[var(--primary)] transition-colors relative group"
                            >
                                How It Works
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link 
                                to="/become-trainer" 
                                className="text-gray-700 font-semibold text-base hover:text-[var(--primary)] transition-colors relative group"
                            >
                                Become a Trainer
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] group-hover:w-full transition-all duration-300"></span>
                            </Link>

                            <div className="flex items-center gap-3 ml-2">
                                <Link
                                    to="/login?mode=signin"
                                    className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-red-50 transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/login?mode=signup"
                                    className="px-5 py-2.5 bg-[var(--primary)] text-white font-bold text-sm rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link 
                                to={getDashboardRoute()} 
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
                                    <FaUser className="text-white text-sm" />
                                </div>
                                <span className="font-bold text-sm text-gray-900">{user?.username}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-5 py-2.5 border-2 border-red-500 text-red-500 font-bold text-sm rounded-xl hover:bg-red-50 transition-all"
                            >
                                <FiLogOut />
                                <span>Logout</span>
                            </button>
                        </>
                    )}
                </div>

                {/* Hamburger (Mobile Only) */}
                <button
                    className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors relative z-50"
                    onClick={() => setIsOpen(true)}
                >
                    <HiMenu className="text-2xl text-gray-700" />
                </button>
            </div>
        </nav>

        {/* Mobile Menu - Outside navbar for proper z-index */}
        {/* Overlay Background */}
        {isOpen && (
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-fade-in"
                onClick={closeMenu}
            ></div>
        )}

        {/* Sidebar Menu */}
        <div
            className={`fixed top-0 left-0 h-screen w-[280px] sm:w-[320px] bg-white shadow-2xl z-[9999] transition-transform duration-300 ease-out overflow-y-auto ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
                {/* Sidebar Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <FaDumbbell className="text-white text-lg" />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="font-bold text-base text-white tracking-tight">Boutique</span>
                                <span className="font-black text-base text-white tracking-tight">Fitness</span>
                            </div>
                        </div>
                        <button
                            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            onClick={closeMenu}
                        >
                            <IoClose className="text-white text-2xl" />
                        </button>
                    </div>
                </div>

                {/* Sidebar Menu Items */}
                <div className="p-6">
                    {!isLoggedIn ? (
                        <div className="space-y-3">
                            <Link 
                                to="/find-trainers" 
                                onClick={closeMenu}
                                className="block px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Find Trainers
                            </Link>

                            <Link 
                                to="/how-it-works" 
                                onClick={closeMenu}
                                className="block px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                            >
                                How It Works
                            </Link>

                            <Link 
                                to="/become-trainer" 
                                onClick={closeMenu}
                                className="block px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Become a Trainer
                            </Link>

                            <div className="pt-6 space-y-3 border-t-2 border-gray-100 mt-6">
                                <Link
                                    to="/login?mode=signin"
                                    className="block px-4 py-3 border-2 border-gray-300 text-gray-700 font-bold text-sm rounded-xl text-center hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-red-50 transition-all"
                                    onClick={closeMenu}
                                >
                                    Sign In
                                </Link>

                                <Link
                                    to="/login?mode=signup"
                                    className="block px-4 py-3 bg-[var(--primary)] text-white font-bold text-sm rounded-xl text-center hover:shadow-lg transition-all"
                                    onClick={closeMenu}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Link
                                to={getDashboardRoute()}
                                className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                onClick={closeMenu}
                            >
                                <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                                    <FaUser className="text-white" />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="font-bold text-sm text-gray-900 truncate">{user?.username}</span>
                                    <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                                </div>
                            </Link>

                            <button
                                onClick={() => {
                                    logout();
                                    closeMenu();
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-500 text-red-500 font-bold text-sm rounded-xl hover:bg-red-50 transition-all"
                            >
                                <FiLogOut />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
