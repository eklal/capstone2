import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../features/user/userSlice";

interface FormData {
  username: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>();
  const dispatch = useDispatch();

  const onSubmit = (data: FormData) => {
    dispatch(login(data.username));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white rounded shadow-md w-80"
      >
        <input
          {...register("username")}
          placeholder="Username"
          className="border p-2 w-full mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
