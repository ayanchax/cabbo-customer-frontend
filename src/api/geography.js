import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const fetchServerGeography = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.GEOGRAPHY.SERVER);
    return data;
  } catch {
    return null;
  }
};

export const fetchClientGeography = async () => {
  try {
    const response = await fetch(ENDPOINTS.GEOGRAPHY.CLIENT, {
      credentials: "omit",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch {
    return null;
  }
};
