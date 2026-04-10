import { useLocalStorage } from "@/hooks";
import { LOCAL_STORAGE_KEYS } from "@/utils";
import { useInitiateLoginMutation, useInitiateOnboardingMutation } from "@/hooks";
const useAuth = () => {
    const { getItem, setItem, removeItem } = useLocalStorage()
    const initiateLoginMutation = useInitiateLoginMutation();
    const initiateOnboardingMutation = useInitiateOnboardingMutation();

    const getToken = () => {
        return getItem(LOCAL_STORAGE_KEYS.token);
    };

    const setToken = (token) => {
        setItem(LOCAL_STORAGE_KEYS.token, token);
    }
    const logout = () => {
        removeItem(LOCAL_STORAGE_KEYS.token);
    }

    return { getToken, setToken, logout, initiateLogin: initiateLoginMutation, initiateOnboarding: initiateOnboardingMutation };
}

export { useAuth }