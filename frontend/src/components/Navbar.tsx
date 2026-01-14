import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FaDumbbell, FaUser } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isLoggedIn, logout } = useAuth();

    const closeMenu = () => setIsOpen(false);

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
        <nav className="w-full fixed top-0 left-0 z-50 bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="flex flex-row font-bold text-xl leading-tight items-center gap-2">
                    <FaDumbbell className="text-2xl text-[var(--primary)]" />
                    <div>
                        <span>Boutique</span><br/>
                        <span className="text-[var(--primary)]">Fitness</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/find-trainers">Find Trainers</Link>
                            <Link to="/how-it-works">How It Works</Link>
                            <Link to="/become-trainer">Become a Trainer</Link>

                            <Link
                                to="/login?mode=signin"
                                className="border border-[var(--primary)] px-4 py-2 rounded-lg"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/login?mode=signup"
                                className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to={getDashboardRoute()} className="flex items-center gap-2">
                                <FaUser className="text-gray-600" />
                                <span className="font-medium">{user?.username}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Hamburger (Mobile Only) */}
                <button
                    className="md:hidden text-3xl"
                    onClick={() => setIsOpen(true)}
                >
                    <HiMenu />
                </button>
            </div>

            {/* Overlay Background */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={closeMenu}
                ></div>
            )}

            {/* Sidebar Menu */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 p-6 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Close Button */}
                <button
                    className="text-3xl absolute right-4 top-4"
                    onClick={closeMenu}
                >
                    <IoClose />
                </button>

                {/* Sidebar Menu Items */}
                <div className="mt-12 flex flex-col gap-6 text-lg">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/find-trainers" onClick={closeMenu}>
                                Find Trainers
                            </Link>

                            <Link to="/how-it-works" onClick={closeMenu}>
                                How It Works
                            </Link>

                            <Link to="/become-trainer" onClick={closeMenu}>
                                Become a Trainer
                            </Link>

                            <Link
                                to="/login?mode=signin"
                                className="mt-6 border border-[var(--primary)] px-4 py-2 rounded-lg text-center"
                                onClick={closeMenu}
                            >
                                Sign In
                            </Link>

                            <Link
                                to="/login?mode=signup"
                                className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-center"
                                onClick={closeMenu}
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to={getDashboardRoute()}
                                className="mt-6 border border-[var(--primary)] px-4 py-2 rounded-lg text-center flex items-center justify-center gap-2"
                                onClick={closeMenu}
                            >
                                <FaUser />
                                <span>{user?.username}</span>
                            </Link>

                            <button
                                onClick={() => {
                                    logout();
                                    closeMenu();
                                }}
                                className="border border-red-500 text-red-500 px-4 py-2 rounded-lg text-center hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
