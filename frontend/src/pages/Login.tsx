import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/user";
import type { User } from "../types/User";
import Logo from '@/assets/logo.svg'
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

import InputField from "@/components/InputField";
import Button from "@/components/Button";

interface LoginFormInputs {
  email: string;
  password: string;
  terms:boolean;
}

const Login: React.FC = () => {

  const { register, handleSubmit, watch,formState: { errors } } = useForm<LoginFormInputs>();

  const mutation = useMutation<User, Error, LoginFormInputs>({
    mutationFn: ({ email, password }) => loginUser(email, password),
    onSuccess: (user) => {
      if (user?.token) {
        localStorage.setItem("authToken", user?.token);
      }
    }

  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => mutation.mutate(data);

   // Watch checkbox value to disable the button
  const termsAccepted = watch("terms");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
   {/* LOGO */}
      <div className="flex justify-center mb-8 mt-6">
        <img src={Logo} alt="logo" className="w-20 h-20" />
      </div>

      <h1 className="text-xl font-bold tracking-wider mb-6 text-purple-300">
        LOGIN / REGISTER
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md">
         {/* EMAIL FIELD */}
        <InputField
          placeholder="Enter Your Email"
          type="email"
          icon={<MdEmail />}
          register={register("email", { required: "Email is required" })}
          error={errors.email?.message}
        />

          {/* PASSWORD FIELD */}
        <InputField
          placeholder="Enter Your Password"
          type="password"
          icon={<RiLockPasswordFill />}
          register={register("password", { required: "Password is required" })}
          error={errors.password?.message}
        />
         {/* TERMS & CONDITIONS */}
        <div className="flex flex-col mt-1">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("terms", {
                required: "You must agree before continuing",
              })}
              className="mt-1"
            />
            <p className="text-sm text-gray-300 leading-5">
              I agree to Fitness Studio’s{" "}
              <a href="#" className="underline text-purple-300">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#" className="underline text-purple-300">
                Privacy Policy
              </a>
            </p>
          </label>

          {errors.terms && (
            <p className="text-red-500 text-sm mt-1">
              {errors.terms.message}
            </p>
          )}
        </div>

          {/* LOGIN BUTTON */}
        <Button
          type="submit"
          text="Login"
          loading={mutation.isPending}
          variant="primary"
          fullWidth
          className="mt-4"
          // Disable login if terms are not accepted
          onClick={() => {}}
          // Button component uses disabled={loading}, so we override with className
          // but best to pass disabled through extra prop
        />

         {/* REGISTER BUTTON */}
        <Button
          type="button"
          text="Register"
          variant="secondary"
          fullWidth
        />

      </form>
    </div>
  );
};

export default Login;
