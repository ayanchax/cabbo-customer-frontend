import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isPhoneNumberValid, sanitizePhoneNumber, APP } from "@/utils";
import { useToast, useGeography, useAuth } from "@/hooks";
import { Disclaimer, LegalAgreementStatement, CountryFlag } from "@/components";
import { ROUTES } from "@/utils";
import { isDevMode } from "@/api";

const LOGIN_MESSAGES = {
  countryUnavailable:
    "We couldn't confirm your country right now. Please try again in a moment.",
  invalidPhone:
    "Please enter a valid 10-digit mobile number.",
  rateLimited:
    "You've requested OTPs a few times. Please wait a little before trying again.",
  otpSendFailed:
    "We couldn't send the OTP right now. Please try again in a moment.",
  alreadyLoggedIn:
    "You're already signed in on another device. Please log out there, then try again.",
  generic:
    "Something didn't go through. Please try again in a moment.",
};

const Login = () => {
  const { initiateLogin, initiateOnboarding } = useAuth();
  const { showToast } = useToast();
  const inputRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const {
    serverGeo: selectedCountry, // Server geography is the source of truth for country selection to ensure correct phone code and validation rules. So, if there is a mismatch between client and server geographies, we will show a disclaimer message to user but we will still rely on server geography for phone number validation and formatting in the backend.
    isMismatch,
  } = useGeography();

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 250); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [shake]);
  const navigate = useNavigate();
  const handleOtpSuccess = (fullPhone, displayPhone, flow, resendTimerData) => {
    navigate(ROUTES.VERIFY, {
      state: {
        phone: fullPhone,
        displayPhone,
        flow,
        resendTimerData,
      },
    });
  };

  const handleOnboarding = async (full_phone_number) => {
    try {
      const response = await initiateOnboarding.mutateAsync({
        phone_number: full_phone_number,
      });
      const resend_timer_data = {
        resend_after: response.data?.resend_interval_seconds || 60,
        last_sent_time: response.data?.last_sent_at || new Date().toISOString(),
      };
      handleOtpSuccess(
        full_phone_number,
        phone,
        "onboarding",
        resend_timer_data,
      );
    } catch (error) {
      const error_code = error?.response?.data?.error_code || null;
      if (isDevMode) {
        console.error("Onboarding initiation failed:", error);
      }
      if (error_code === "OTP_ALREADY_SENT") {
        handleOtpSuccess(full_phone_number, phone, "onboarding");
        return;
      }
      if(error_code ==="OTP_RATE_LIMITED"){
        showToast(LOGIN_MESSAGES.rateLimited, "error");
        return;
      }
      if (error_code ==="OTP_SEND_FAILED"){
        showToast(LOGIN_MESSAGES.otpSendFailed, "error");
        return;
      }
      
      showToast(LOGIN_MESSAGES.generic, "error");
    } finally {
      setShake(false);
    }
  };

  const handleSendOtp = async () => {
    if (!selectedCountry?.phone_code) {
      showToast(
        LOGIN_MESSAGES.countryUnavailable,
        "error",
      );
      return;
    }

    // 1. Sanitize FIRST
    const sanitizedLocal = sanitizePhoneNumber(
      phone,
      selectedCountry.phone_code,
    );

    // 2. Validate AFTER sanitization, now phone is in local format without country code, and we can show a generic error message for all countries as backend will validate per country rules.
    if (!sanitizedLocal || !isPhoneNumberValid(sanitizedLocal)) {
      setTimeout(() => setShake(true), 0);
      inputRef.current?.focus();
      setError("Enter a valid 10-digit phone number");
      return;
    }

    setError("");
    //Attach country code to the sanitized local phone number to get the full international format before sending to API.
    const fullPhone = `${selectedCountry.phone_code}${sanitizedLocal}`;

    try {
      const response = await initiateLogin.mutateAsync({
        phone_number: fullPhone,
      });

      const resend_timer_data = {
        resend_after: response.data?.resend_interval_seconds || 60,
        last_sent_time: response.data?.last_sent_at || new Date().toISOString(),
      };
      handleOtpSuccess(fullPhone, phone, "login", resend_timer_data);
    } catch (error) {
      const status = error?.response?.status;
      const error_code = error?.response?.data?.error_code || null;
      if (status === 404) {
        // 🔥 fallback to onboarding as customer does not exist.
        await handleOnboarding(fullPhone);
      } else if (status === 429) {
        showToast(LOGIN_MESSAGES.rateLimited, "error");
      } else if (status === 400) {
        if (error_code === "OTP_ALREADY_SENT") {
          handleOtpSuccess(fullPhone, phone, "login");
          return;
        }
        if (error_code === "ALREADY_LOGGED_IN") {
          // In the future, we could enhance this flow by showing a modal with seeking consent from user to continue on this device with the new login which would invalidate the old session. For now, we will just show a toast message.
          // We will not support login from multiple devices, as we are a ride-hailing app and it's safer to assume that a user should only be logged in from one device at a time to prevent misuse and ensure security.
          // Refer backlogs.md for the future Consent-Based Device Switching flow todo
          showToast(
            LOGIN_MESSAGES.alreadyLoggedIn,
            "error",
          );
          return;
        }
        showToast(LOGIN_MESSAGES.invalidPhone, "error");
      } 
      else if(status===500){
        if (error_code ==="OTP_SEND_FAILED"){
        showToast(LOGIN_MESSAGES.otpSendFailed, "error");
        }
      else {
        showToast(LOGIN_MESSAGES.generic, "error");
      }
      }
      else {
        showToast(LOGIN_MESSAGES.generic, "error");
      }
    } finally {
      setShake(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <div className="w-full max-w-lg p-12 bg-white rounded-3xl shadow-lg border border-gray-100">
        <div className="mb-8 text-center flex flex-col items-center">
          <img
            src={import.meta.env.VITE_APP_LOGO_URL}
            alt={APP.name}
            className="w-28 h-auto mb-4"
          />
          <p className="text-base text-gray-500">{APP.tagline}</p>
        </div>

        {isMismatch && (
          <Disclaimer
            message={`Looks like you're outside ${selectedCountry?.country_name}. ${APP.name} currently operates in
            ${selectedCountry?.country_name} — please use a ${selectedCountry?.country_name} mobile number.`}
            dismissible
          />
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendOtp();
          }}
        >
          <div className="mb-6">
            <label className="text-sm text-gray-500 mb-2 block" htmlFor="phone">
              Phone number
            </label>

            <div
              className={`mt-1 flex min-h-12 items-center border rounded-xl overflow-hidden
      transition-[box-shadow,border-color] duration-200 ease-in-out
      focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1
      hover:border-gray-400
      ${error ? "border-red-500 focus-within:ring-red-500" : ""}
      ${shake ? "animate-shake" : ""}
    `}
            >
              {/* Country prefix */}
              <div className="flex shrink-0 self-stretch items-center gap-2 border-r border-gray-200 bg-gray-50 pl-3 pr-4 text-sm text-gray-700 whitespace-nowrap">
                <CountryFlag countryCode={selectedCountry?.country_code} />
                <span className="font-medium">
                  {selectedCountry?.phone_code}
                </span>
              </div>

              {/* Input */}
              <input
                type="tel"
                id="phone"
                maxLength={10}
                ref={inputRef}
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError("");
                }}
                className="min-w-0 flex-1 px-4 py-3 text-[15px] outline-none bg-transparent"
              />
            </div>

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={initiateLogin.isPending || initiateOnboarding.isPending}
            className="
  w-full 
  bg-primary 
  text-white 
  py-3.5 
  rounded-xl 
  font-semibold 
  text-base
  transition-all duration-200
  hover:bg-primary-hover
  hover:shadow-md
  active:scale-[0.98]
  disabled:opacity-50
  disabled:cursor-not-allowed
  cursor-pointer
"
          >
            {initiateLogin.isPending ? "Please wait..." : "Continue"}
          </button>
        </form>

        {/*  */}
        <LegalAgreementStatement/>
         
      </div>
    </div>
  );
};

export default Login;
