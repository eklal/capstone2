import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import Input from "../ui/Input";

interface SignUpInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "trainer" | "client";
}

const SignUpForm: React.FC = () => {
  const { signUp, isSigningUp, signUpError, resetSignUpError } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<SignUpInputs>();

  const password = watch("password");

  // Show backend error under email field
  useEffect(() => {
    if (signUpError) {
      setError("email", {
        message: signUpError.message || "Signup failed",
      });
    }
  }, [signUpError, setError]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      resetSignUpError();
    };
  }, [resetSignUpError]);

  const onSubmit: SubmitHandler<SignUpInputs> = (data) => {
    signUp({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Username */}
      <Input
        label="Username"
        type="text"
        placeholder="Enter your username"
        {...register("username", {
          required: "Username is required",
          pattern: {
            value: /^[a-zA-Z0-9]+$/,
            message: "Invalid username format",
          },
        })}
        error={errors.username?.message}
      />
      {/* Email */}
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Invalid email format",
          },
        })}
        error={errors.email?.message}
      />


      {/* Password */}
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
          pattern: {
            value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/,
            message: "Password must include letter, number, and symbol",
          },
        })}
        error={errors.password?.message}
      />

      {/* Confirm Password */}
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        {...register("confirmPassword", {
          required: "Confirm your password",
          validate: (value) =>
            value === password || "Passwords do not match",
        })}
        error={errors.confirmPassword?.message}
      />

      {/* Role Selection */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">I am a</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="client"
              {...register("role", { required: "Please select a role" })}
              className="w-4 h-4 text-sm text-gray-600"
            />
            <span className="text-sm text-gray-600">Client</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="trainer"
              {...register("role", { required: "Please select a role" })}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-600">Trainer</span>
          </label>
        </div>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[var(--primary)] text-white py-2 rounded-md mt-4 transition"
        disabled={isSigningUp}
      >
        {isSigningUp ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default SignUpForm;
