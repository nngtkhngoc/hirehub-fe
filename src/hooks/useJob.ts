import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllJobs, createJob } from "@/apis/job.api";
import { toast } from "sonner";

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
