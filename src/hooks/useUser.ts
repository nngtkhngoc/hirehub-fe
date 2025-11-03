import { getAllRecruiters, getAllUsers } from "@/apis/user.api";
import { useQuery } from "@tanstack/react-query";

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
