import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const fetchGeography = async () => {
  const { data } = await api.get(ENDPOINTS.GEOGRAPHY);
  return data;
};