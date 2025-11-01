import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { getProfile, signOut } from "@/apis/auth.api";

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
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
  });
};
