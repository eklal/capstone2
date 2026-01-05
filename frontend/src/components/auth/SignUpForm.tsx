import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signUpUser } from "@/api/user";
import Input from "../ui/Input";

interface SignUpInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<SignUpInputs>();

  const password = watch("password");

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      signUpUser(data),

    onError: (error: any) => {
      // Backend error → show under email field
      setError("email", {
        message: error?.response?.data?.message || "Signup failed",
      });
    },

    onSuccess: (user) => {
      console.log("User registered", user);
      // You can redirect user or auto-login here if needed
    },
  });

  const onSubmit: SubmitHandler<SignUpInputs> = (data) => {
    mutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[var(--primary)] text-white py-2 rounded-md mt-4 transition"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default SignUpForm;
