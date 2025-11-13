import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/user";
import type { User } from "../types/User";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const mutation = useMutation<User, Error, LoginFormInputs>({
    mutationFn: ({email, password}) => loginUser(email, password),
    onSuccess: (user) => {
      if(user?.token) {
        localStorage.setItem("authToken", user?.token);
      }
    }

});

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80 mx-auto mt-20">
      <input
        type="email"
        placeholder="Email"
        {...register("email", { required: "Email is required" })}
        className="p-2 border rounded"
      />
      {errors.email && <span className="text-red-500">{errors.email.message}</span>}

      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: "Password is required" })}
        className="p-2 border rounded"
      />
      {errors.password && <span className="text-red-500">{errors.password.message}</span>}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {mutation.isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
