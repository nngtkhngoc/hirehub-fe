import { getAllLanguages } from "@/apis/language.api";
import { useQuery } from "@tanstack/react-query";

export const useLanguage = () => {
  return useQuery({
    queryKey: ["languages"],
    queryFn: () => getAllLanguages(),
  });
};
