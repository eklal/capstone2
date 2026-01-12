import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser as loginUserApi, signUpUser as signUpUserApi, getCurrentUser, logoutUser as logoutUserApi } from "@/api/user";
import { setCredentials, logout as logoutAction } from "@/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import type { User, LoginCredentials, SignUpData } from "@/types/User";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn, token } = useAppSelector((state) => state.user);

  // Sign up mutation
  const signUpMutation = useMutation<User, Error, SignUpData>({
    mutationFn: (data: SignUpData) => signUpUserApi(data),
    onSuccess: (user) => {
      if (user?.token) {
        dispatch(setCredentials({ user, token: user.token }));
        navigate("/");
      }
    },
  });

  // Login mutation
  const loginMutation = useMutation<User, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => loginUserApi(credentials),
    onSuccess: (user) => {
      if (user?.token) {
        dispatch(setCredentials({ user, token: user.token }));
        navigate("/");
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUserApi,
    onSuccess: () => {
      dispatch(logoutAction());
      navigate("/login");
    },
    onError: () => {
      // Even if API fails, logout locally
      dispatch(logoutAction());
      navigate("/login");
    },
  });

  // Fetch current user (when token exists)
  const { data: currentUser, refetch: refetchUser } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!token && isLoggedIn,
    retry: false,
  });

  // Logout function
  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    // Mutations
    signUp: signUpMutation.mutate,
    signUpAsync: signUpMutation.mutateAsync,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout,

    // State
    user: currentUser || user,
    isLoggedIn,
    token,

    // Loading states
    isSigningUp: signUpMutation.isPending,
    isLoggingIn: loginMutation.isPending,

    // Errors
    signUpError: signUpMutation.error,
    loginError: loginMutation.error,

    // Reset functions
    resetSignUpError: signUpMutation.reset,
    resetLoginError: loginMutation.reset,

    // User refetch
    refetchUser,
  };
};
