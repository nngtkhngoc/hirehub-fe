import { getAllRecruiters } from "@/apis/user.api";
import { useQuery } from "@tanstack/react-query";

export const useRecruiter = (
  keyword?: string,
  province?: string,
  page?: number,
  size?: number
) => {
  return useQuery({
    queryKey: ["recruiters", keyword, province, page, size],
    queryFn: () =>
      getAllRecruiters({ keyword, province, role: "recruiter", page, size }),
  });
};
