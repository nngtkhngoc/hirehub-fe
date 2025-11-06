import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createExperience } from "@/apis/experience.api";

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
