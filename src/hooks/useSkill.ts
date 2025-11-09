import { getAllSkills } from "@/apis/skill.api";
import { useQuery } from "@tanstack/react-query";

export const useSkill = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () => getAllSkills(),
  });
};
