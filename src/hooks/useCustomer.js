import { useContext } from "react";
import { CustomerContext } from "@/context";
export const useCustomer = () => {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error("useCustomer must be used within CustomerProvider");
  }

  return context;
};