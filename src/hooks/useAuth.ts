/* eslint-disable no-extra-boolean-cast */
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  getProfile,
  signOut,
  signUpCandidate,
  signUpRecruiter,
} from "@/apis/auth.api";
import type { AxiosError } from "axios";

export const useSignOut = () => {
  const logout = useAuthStore((state) => state.logout);
  const nav = useNavigate();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      logout();

      toast.success("Đăng xuất thành công!", { duration: 1500 });

      setTimeout(() => nav("/"), 800);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Đăng xuất thất bại!", { duration: 2000 });
    },
  });
};

export const useProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    select: (profile) => {
      setUser(profile);
      console.log("hello", profile);
      return profile;
    },
  });

  return query;
};

export const useSignUpCandidate = () => {
  return useMutation({
    mutationFn: signUpCandidate,
    onSuccess: () => {
      toast.success("Đăng kí thành công!", { duration: 1500 });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string }>;
      console.error(err.response?.data?.message);
      toast.error(err.response?.data?.message || "Đăng kí thất bại!", {
        duration: 2000,
      });
    },
  });
};

export const useSignUpRecruiter = () => {
  return useMutation({
    mutationFn: signUpRecruiter,
    onSuccess: () => {
      toast.success("Đăng kí thành công!", { duration: 1500 });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string }>;
      console.error(err.response?.data?.message);
      toast.error(err.response?.data?.message || "Đăng kí thất bại!", {
        duration: 2000,
      });
    },
  });
};
