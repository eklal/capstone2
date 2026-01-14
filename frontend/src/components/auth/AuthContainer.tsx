import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaDumbbell } from "react-icons/fa";

import AuthToggle from "./AuthToggle";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const AuthContainer: React.FC = () => {
      const location = useLocation();

         // Initialize mode based on URL
    const getModeFromQuery = () => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get("mode") === "signup" ? "signup" : "signin";
    };
    
    const [mode, setMode] = useState<"signin" | "signup">(getModeFromQuery() );
    useEffect(() => {
        setMode(getModeFromQuery());
    }, [location.search]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-24 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-96 h-96 bg-[var(--primary)] rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--primary)] rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl mb-6 group hover:scale-110 transition-transform">
                        <FaDumbbell className="text-white text-2xl" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Welcome to <span className="text-[var(--primary)]">Boutique Fitness</span>
                    </h1>
                    <p className="text-gray-600 text-base">
                        {mode === "signin" 
                            ? "Sign in to continue your fitness journey" 
                            : "Create an account to get started"}
                    </p>
                </div>

                {/* Toggle */}
                <AuthToggle mode={mode} setMode={setMode} />

                {/* Form Container */}
                <div className="relative mt-6 w-full overflow-hidden rounded-2xl shadow-2xl border-2 border-gray-100 bg-white">
                    <div className="flex transition-transform duration-500">
                        <div className="w-full p-8 md:p-10">
                            {mode === "signin" ? <SignInForm /> : <SignUpForm />}
                        </div>
                    </div>
                </div>

                {/* Footer Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Are you a fitness trainer?{" "}
                    <Link to="/register-trainer" className="text-[var(--primary)] font-bold hover:underline">
                        Join as a Trainer
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AuthContainer;
