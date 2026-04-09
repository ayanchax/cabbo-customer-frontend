import { api } from "@/api";

export const initiateLogin = (payload) => {
  return api.post("/api/v1/auth/login/initiate", payload);
};

export const verifyLogin = (payload) => {
  return api.post("/api/v1/auth/login", payload);
};