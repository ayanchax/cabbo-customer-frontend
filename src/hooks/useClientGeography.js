import { useGeographyQuery } from "./query";
export const useClientGeography = () => {
    const { clientGeographyData } = useGeographyQuery();
    return { clientGeographyData }
}
