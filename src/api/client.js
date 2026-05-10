import axios from "axios";
import { LOCAL_STORAGE_KEYS } from "@/utils";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.token);
  if (token && typeof token === "string") {
     config.headers.Authorization = `Bearer ${token}`;
  } 
  return config;
});

export { api };