import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllJobs, createJob } from "@/apis/job.api";
import { toast } from "sonner";

export const useJobs = (keyword?: string, province?: string) => {
  return useQuery({
    queryKey: ["jobs", keyword, province],
    queryFn: () => getAllJobs({ keyword, province }),
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      toast.success("Tạo job thành công!", { duration: 2000 });

      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => {
      toast.error("Tạo job thất bại!", { duration: 2500 });
    },
  });
};
