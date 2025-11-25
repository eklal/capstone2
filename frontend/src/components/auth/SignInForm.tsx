import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/user";
import type { User } from "@/types/User";
import Input from "../ui/Input";
import AuthModal from "./AuthModal";

interface SignInFormInputs {
    email: string;
    password: string;
    remember: boolean;
}

const SignInForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, watch, setError } = useForm<SignInFormInputs>();

    const mutation = useMutation<User, Error, SignInFormInputs>({
        mutationFn: ({ email, password }) => loginUser(email, password),
        onSuccess: (user) => {
            if (user?.token) {
                localStorage.setItem("authToken", user?.token);
            }
        },
        onError: (error: any) => {
            // example: show API error under password field
            setError("password", { message: error.message || "Invalid credentials" });
        }
    });

    const [authProvider, setAuthProvider] = useState<"google" | "facebook" | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleGoogleLogin = () => {
        setAuthProvider("google");
        setModalOpen(true);
    };

    const handleFacebookLogin = () => {
        setAuthProvider("facebook");
        setModalOpen(true);
    };

    const onSubmit: SubmitHandler<SignInFormInputs> = (data) => mutation.mutate(data);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md mx-auto">
                {/* EMAIL */}
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" }
                    })}
                    error={errors.email?.message}
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
                    <label className="flex items-center gap-2">
                        <input type="checkbox" {...register("remember")} />
                        Remember me
                    </label>
                    <a className="text-gray-600 cursor-pointer">Forgot password?</a>
                </div>

                {/* SIGN IN BUTTON */}
                <button
                    type="submit"
                    className="w-full bg-[var(--primary)] text-white py-2 rounded-md hover:bg-primary-dark transition"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Signing in..." : "Sign In"}
                </button>

                {/* OR CONTINUE WITH */}
                <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 border" />
                    <span className="text-gray-400 text-sm">Or continue with</span>
                    <div className="flex-1 border" />
                </div>



            </form>
            {/* SOCIAL LOGIN */}
            <div className="flex gap-4">
                <button type="button"
                    className="flex-1 border py-2 rounded-md flex items-center justify-center gap-2" onClick={handleGoogleLogin}
                >
                    🌐 Google
                </button>
                <button type="button" className="flex-1 border py-2 rounded-md flex items-center justify-center gap-2" onClick={handleFacebookLogin}
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
