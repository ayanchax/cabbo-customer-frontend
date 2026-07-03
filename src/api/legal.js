import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const getLegalPages = async () => {
  const { data } = await api.get(ENDPOINTS.LEGAL.PAGES);
  return data;
};

export const getLegalPageBySlug = async (slug) => {
  const { data } = await api.get(`${ENDPOINTS.LEGAL.PAGES}/${slug}`);
  return data;
};
