import { useGeographyQuery } from "@/hooks";
import {utcOffsetStringToMinutes} from "@/utils"
export const useTimezone = () => {
    const { clientGeographyData } = useGeographyQuery();

    const timezone = {
       timezone: clientGeographyData?.timezone || "UTC", // Default to UTC if timezone is not available 
       utc_offset: clientGeographyData?.utc_offset || "+00:00", // Default to +00:00 if UTC offset is not available
       utc_offset_minutes: clientGeographyData?.utc_offset ? utcOffsetStringToMinutes(clientGeographyData.utc_offset) : 0, // Convert UTC offset to total minutes
    }

    return { timezone }
}
