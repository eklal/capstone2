import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import Input from "../ui/Input";
import AuthModal from "./AuthModal";

interface SignInFormInputs {
    username: string;
    password: string;
    remember: boolean;
}

const SignInForm: React.FC = () => {
    const { login, isLoggingIn, loginError, resetLoginError } = useAuth();

    const { register, handleSubmit, formState: { errors }, setError } = useForm<SignInFormInputs>();

    const [authProvider, setAuthProvider] = useState<"google" | "facebook" | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);

    // Show backend error under password field
    useEffect(() => {
        if (loginError) {
            setError("password", { message: loginError.message || "Invalid credentials" });
        }
    }, [loginError, setError]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            resetLoginError();
        };
    }, [resetLoginError]);

    const handleGoogleLogin = () => {
        setAuthProvider("google");
        setModalOpen(true);
    };

    const handleFacebookLogin = () => {
        setAuthProvider("facebook");
        setModalOpen(true);
    };

    const onSubmit: SubmitHandler<SignInFormInputs> = (data) => {
        login({ username: data.username, password: data.password });
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md mx-auto">
                {/* USERNAME */}
                <Input
                    label="Username"
                    type="text"
                    placeholder="Enter your username"
                    {...register("username", {
                        required: "Username is required",
                    })}
                    error={errors.username?.message}
                />

                {/* PASSWORD */}
                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Password must be at least 8 characters" },
                        pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/,
                            message: "Password must include letter, number, and symbol"
                        }
                    })}
                    error={errors.password?.message}
                />

                {/* REMEMBER ME & FORGOT PASSWORD */}
                <div className="flex items-center justify-between text-sm mt-2 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" {...register("remember")} className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]" />
                        <span className="font-medium text-gray-700">Remember me</span>
                    </label>
                    <a className="text-[var(--primary)] font-semibold cursor-pointer hover:underline">Forgot password?</a>
                </div>

                {/* SIGN IN BUTTON */}
                <button
                    type="submit"
                    className="w-full bg-[var(--primary)] text-white py-3.5 rounded-xl font-bold text-base hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? "Signing in..." : "Sign In"}
                </button>

                {/* OR CONTINUE WITH */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 border-t border-gray-300" />
                    <span className="text-gray-500 text-sm font-medium">Or continue with</span>
                    <div className="flex-1 border-t border-gray-300" />
                </div>



            </form>
            {/* SOCIAL LOGIN */}
            <div className="flex gap-4 mt-4">
                <button type="button"
                    className="flex-1 border-2 border-gray-300 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:border-[var(--primary)] hover:bg-red-50 transition-all" onClick={handleGoogleLogin}
                >
                    🌐 Google
                </button>
                <button type="button" className="flex-1 border-2 border-gray-300 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:border-[var(--primary)] hover:bg-red-50 transition-all" onClick={handleFacebookLogin}
                >
                    📘 Facebook
                </button>
            </div>
            <AuthModal
                isOpen={isModalOpen}
                provider={authProvider}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
};

export default SignInForm;
