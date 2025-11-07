import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllJobs,
  createJob,
  getJobById,
  saveJob,
  getSavedJobsByUserId,
  applyJob,
  getAppliedJobsByUserId,
} from "@/apis/job.api";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

export const useJobs = (
  keyword?: string,
  province?: string,
  page?: number,
  size?: number
) => {
  return useQuery({
    queryKey: ["jobs", keyword, province, page, size],
    queryFn: () => getAllJobs({ keyword, province, page, size }),
  });
};

export const useJobDetails = (id?: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      toast.success("Tạo job thành công!", { duration: 2000 });

      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Tạo job thất bại!", { duration: 2500 });
    },
  });
};

export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveJob,
    onSuccess: () => {
      toast.success("Lưu job thành công!", { duration: 2000 });

      queryClient.invalidateQueries({
        queryKey: ["saved-jobs"],
        exact: false,
        refetchType: "active",
      });
    },
    onError: () => {
      toast.error("Lưu job thất bại!", { duration: 2500 });
    },
  });
};

export const useGetSavedJobs = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["saved-jobs", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const data = await getSavedJobsByUserId({ userId: user?.id });
      return data ?? [];
    },
    enabled: !!user?.id,
    initialData: [],
  });
};

export const useApplyJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyJob,
    onMutate: () => {
      toast.loading("Đang tải dữ liệu", {
        id: "loading-toast-apply",
      });
    },
    onSuccess: () => {
      toast.success("Ứng tuyển thành công!", { duration: 2000 });
      toast.dismiss("loading-toast-apply");

      queryClient.invalidateQueries({
        queryKey: ["applied-jobs"],
        exact: false,
        refetchType: "active",
      });
    },
    onError: () => {
      toast.error("Ứng tuyển thất bại!", { duration: 2500 });
    },
  });
};

export const useGetAppliedJobs = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["applied-jobs", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const data = await getAppliedJobsByUserId({ userId: user?.id });
      return data ?? [];
    },
    enabled: !!user?.id,
    initialData: [],
  });
};
