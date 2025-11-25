import React, { useState } from "react";
import AuthToggle from "./AuthToggle";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const AuthContainer: React.FC = () => {
    const [mode, setMode] = useState<"signin" | "signup">("signin");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center mb-8">
                <div className="bg-black text-white w-12 h-12 flex items-center justify-center rounded-lg mx-auto mb-4">
                    <span className="font-bold text-xl">🏋️</span>
                </div>
                <h1 className="text-2xl font-semibold">Welcome to <span className="text-black font-bold">Boutique Fitness</span></h1>
                <p className="text-gray-600 text-sm">
                    Sign in to your account or create a new one
                </p>
            </div>

            {/* Toggle */}
            <AuthToggle mode={mode} setMode={setMode} />

            {/* Animated Slider */}
            <div className="relative mt-6 w-full max-w-md overflow-hidden rounded-xl shadow border bg-white">
                <div
                    className="flex transition-transform duration-500"
                    // style={{ transform: mode === "signin" ? "translateX(0%)" : "translateX(-50%)" }}
                >
                    <div className="w-full p-12">
                        {mode === "signin" ? <SignInForm /> : <SignUpForm />}
                    </div>


                </div>
            </div>

            <p className="mt-6 text-sm text-gray-600">
                Are you a fitness trainer?{" "}
                <a className="text-black font-semibold cursor-pointer">Join as a Trainer</a>
            </p>
        </div>
    );
};

export default AuthContainer;
