import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const fetchServerGeography = async () => {
  const { data } = await api.get(ENDPOINTS.GEOGRAPHY.SERVER);
  return data;
};

export const fetchClientGeography = async () => {
  const {data } = await api.get(ENDPOINTS.GEOGRAPHY.CLIENT);
  return data;
}