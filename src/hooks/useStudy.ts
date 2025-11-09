import {
  createStudy,
  deleteStudy,
  getAllUniversities,
  updateStudy,
} from "@/apis/study.api";
import type { UpdateStudyData } from "@/types/Study";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUniversity = () => {
  return useQuery({
    queryKey: ["universities"],
    queryFn: () => getAllUniversities(),
  });
};

export const useCreateStudy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudy,
    onMutate: () => {
      toast.loading("Đang tải dữ liệu", {
        id: "loading-toast-create-study",
      });
    },
    onSuccess: () => {
      toast.success("Thêm học vấn thành công!", { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.dismiss("loading-toast-create-study");
    },
    onError: () => {
      toast.error("Thêm học vấn thất bại!", { duration: 2500 });
      toast.dismiss("loading-toast-create-study");
    },
  });
};

export const useUpdateStudy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudyData }) =>
      updateStudy(data, id),
    onMutate: () => {
      toast.loading("Đang tải dữ liệu", {
        id: "loading-toast-update-study",
      });
    },
    onSuccess: () => {
      toast.success("Cập nhật học vấn thành công!", { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.dismiss("loading-toast-update-study");
    },
    onError: () => {
      toast.error("Cập nhật học vấn thất bại!", { duration: 2500 });
      toast.dismiss("loading-toast-update-study");
    },
  });
};

export const useDeleteStudy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudy,
    onMutate: () => {
      toast.loading("Đang tải dữ liệu", {
        id: "loading-toast-delete-study",
      });
    },
    onSuccess: () => {
      toast.success("Xóa học vấn thành công!", { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.dismiss("loading-toast-delete-study");
    },
    onError: () => {
      toast.error("Xóa học vấn thất bại!", { duration: 2500 });
      toast.dismiss("loading-toast-delete-study");
    },
  });
};
