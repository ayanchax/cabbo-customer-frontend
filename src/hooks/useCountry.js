import { useContext } from "react";
import { CountryContext } from "@/context";

export const useCountry = () => useContext(CountryContext);