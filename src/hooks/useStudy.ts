import { createStudy, getAllUniversities } from "@/apis/study.api";
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
    onSuccess: () => {
      toast.success("Thêm học vấn thành công!", { duration: 2000 });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Thêm học vấn thất bại!", { duration: 2500 });
    },
  });
};

// export const useUpdateExperience = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       id,
//       data,
//     }: {
//       id: string;
//       data: UpdateExperienceFormData;
//     }) => updateExperience(data, id),
//     onMutate: () => {
//       toast.loading("Đang tải dữ liệu", {
//         id: "loading-toast-update-experience",
//       });
//     },
//     onSuccess: () => {
//       toast.success("Cập nhật kinh nghiệm thành công!", { duration: 2000 });
//       queryClient.invalidateQueries({ queryKey: ["profile"] });
//       toast.dismiss("loading-toast-update-experience");
//     },
//     onError: () => {
//       toast.error("Cập nhật kinh nghiệm thất bại!", { duration: 2500 });
//       toast.dismiss("loading-toast-update-experience");
//     },
//   });
// };

// export const useDeleteExperience = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteExperience,
//     onMutate: () => {
//       toast.loading("Đang tải dữ liệu", {
//         id: "loading-toast-delete-experience",
//       });
//     },
//     onSuccess: () => {
//       toast.success("Xóa kinh nghiệm thành công!", { duration: 2000 });
//       queryClient.invalidateQueries({ queryKey: ["profile"] });
//       toast.dismiss("loading-toast-delete-experience");
//     },
//     onError: () => {
//       toast.error("Xóa kinh nghiệm thất bại!", { duration: 2500 });
//       toast.dismiss("loading-toast-delete-experience");
//     },
//   });
// };
