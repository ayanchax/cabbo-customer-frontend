import { useQuery } from "@tanstack/react-query";
import { getLegalPages } from "@/api";

export const useLegalPages = () => {
  return useQuery({
    queryKey: ["legalPages"],
    queryFn: getLegalPages,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
