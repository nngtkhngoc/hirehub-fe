import {
  getAllRecruiters,
  getAllUsers,
  getUserById,
  updateUser,
} from "@/apis/user.api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRecruiter = (
  keyword?: string,
  province?: string,
  page?: number,
  size?: number
) => {
  return useQuery({
    queryKey: ["recruiters", keyword, province, page, size],
    queryFn: () => getAllRecruiters({ keyword, province, page, size }),
  });
};

export const useUsers = (page?: number, size?: number) => {
  return useQuery({
    queryKey: ["users", page, size],
    queryFn: () => getAllUsers({ page, size }),
  });
};

export const useUpdateUser = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => updateUser(formData),
    onMutate: () => {
      toast.loading("Đang tải dữ liệu", {
        id: "loading-toast-update-user",
      });
    },
    onSuccess: () => {
      // setUser(user);
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.dismiss("loading-toast-update-user");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Cập nhật thất bại!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.dismiss("loading-toast-update-user");
    },
  });
};

export const useUserById = (userId: number) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  });
};
