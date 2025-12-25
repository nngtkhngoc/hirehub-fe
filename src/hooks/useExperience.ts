import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createExperience,
  deleteExperience,
  updateExperience,
} from "@/apis/experience.api";
import type { UpdateExperienceFormData } from "@/types/Experience";

// export const useExperience = (
//   keyword?: string,
//   province?: string,
//   page?: number,
//   size?: number
// ) => {
//   return useQuery({
//     queryKey: ["jobs", keyword, province, page, size],
//     queryFn: () => getAllJobs({ keyword, province, page, size }),
//   });
// };

export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExperience,
    onSuccess: () => {
      toast.success("Thêm kinh nghiệm thành công!", { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Thêm kinh nghiệm thất bại!", { duration: 2500 });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateExperienceFormData;
    }) => updateExperience(data, id),
    onMutate: () => {
      toast.loading("Đang tải dữ liệu", {
        id: "loading-toast-update-experience",
      });
    },
    onSuccess: () => {
      toast.success("Cập nhật kinh nghiệm thành công!", { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.dismiss("loading-toast-update-experience");
    },
    onError: () => {
      toast.error("Cập nhật kinh nghiệm thất bại!", { duration: 2500 });
      toast.dismiss("loading-toast-update-experience");
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExperience,
    onMutate: () => {
      toast.loading("Đang tải dữ liệu", {
        id: "loading-toast-delete-experience",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Xóa kinh nghiệm thành công!", { duration: 2000 });
      toast.dismiss("loading-toast-delete-experience");
    },
    onError: () => {
      toast.error("Xóa kinh nghiệm thất bại!", { duration: 2500 });
      toast.dismiss("loading-toast-delete-experience");
    },
  });
};
