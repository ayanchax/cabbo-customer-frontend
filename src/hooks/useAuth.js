import { LOCAL_STORAGE_KEYS } from "@/utils";
import {
    useInitiateLoginMutation,
    useInitiateOnboardingMutation,
    useResendOtpMutation,
    useVerifyLoginOtpMutation,
    useVerifyOnboardingOtpMutation,
    useOnboardingMutation,
} from "./mutation";
const useAuth = () => {
    const initiateLoginMutation = useInitiateLoginMutation();
    const initiateOnboardingMutation = useInitiateOnboardingMutation();
    const resendOtpMutation = useResendOtpMutation();
    const verifyLoginOtpMutation = useVerifyLoginOtpMutation();
    const verifyOnboardingOtpMutation = useVerifyOnboardingOtpMutation();
    const onboardingAndLoginMutation = useOnboardingMutation();
    

    return { initiateLogin: initiateLoginMutation, initiateOnboarding: initiateOnboardingMutation, resendOtp: resendOtpMutation, verifyLogin: verifyLoginOtpMutation, verifyOnboarding: verifyOnboardingOtpMutation, onboardAndLogin: onboardingAndLoginMutation };
}

export { useAuth }
