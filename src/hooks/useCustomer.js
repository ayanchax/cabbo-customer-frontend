import { useContext } from "react";
import { CustomerContext } from "@/context";

const getFirstName = (name) => {
  if (!name || typeof name !== "string") return "there";

  const nameParts = name.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length === 0) return "there";

  if (nameParts.length > 2) {
    return `${nameParts[0]} ${nameParts[1][0]}.`;
  }

  return nameParts[0];
};

function formatJoinedOn(joinedOn) {
  if (!joinedOn) return null;

  const joinedDate = new Date(joinedOn);
  if (Number.isNaN(joinedDate.getTime())) return null;

  return joinedDate.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

export const useCustomer = () => {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error("useCustomer must be used within CustomerProvider");
  }

  return {
    ...context,
    firstName: getFirstName(context?.customer?.name),
    getFirstName,
    joinedOn: formatJoinedOn(context?.customer?.joined_on),
  };
};
