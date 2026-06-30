export const useCustomerUtility = () => {

    const getFirstName = (name) => {
        if (!name) return "there";
        let nameParts = name.trim().split(" ");
        if (nameParts.length === 0) return "there";
        if (nameParts.length > 2) { //Name has more than 2 parts, we can assume it's something like "John Doe Smith" and we want to show "John D."
            // Handle cases like "John Doe Smith" → "John D."
            return `${nameParts[0]} ${nameParts[1][0]}.`;
        }
        return nameParts[0];
    }

    return {getFirstName}
}