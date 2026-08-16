import { useQuery } from "@tanstack/react-query";
import { getLegalPageBySlug } from "@/api";

export const useLegalPage = (slug) => {
  return useQuery({
    queryKey: ["legalPage", slug],
    queryFn: () => getLegalPageBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: false,
  });
};
