import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isPhoneNumberValid, sanitizePhoneNumber, APP } from "@/utils";
import { useToast, useGeography, useAuth } from "@/hooks";
import { Disclaimer } from "@/components";
import { routes } from "@/routes";

const Login = () => {
  const { initiateLogin, initiateOnboarding } = useAuth();
  const { showToast } = useToast();
  const inputRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const {
    serverGeo: selectedCountry, // Server geography is the source of truth for country selection to ensure correct phone code and validation rules
    isMismatch,
  } = useGeography();

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 250); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [shake]);
  const navigate = useNavigate();
  const handleOtpSuccess = (fullPhone, displayPhone, flow) => {
    navigate(routes.verify, {
      state: {
        phone: fullPhone,
        displayPhone,
        flow,
      },
    });
  };

  const handleOnboarding = async (full_phone_number) => {
    try {
      await initiateOnboarding.mutateAsync({ phone_number: full_phone_number });
      handleOtpSuccess(full_phone_number, phone, "onboarding");
    } catch (error) {
      console.error("Onboarding initiation failed:", error);
      showToast("Something went wrong", "error");
    } finally {
      setShake(false);
    }
  };

  const handleSendOtp = async () => {
    if (!selectedCountry?.phone_code) {
      showToast(
        "Unable to determine your country. Please try again later.",
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
      await initiateLogin.mutateAsync({ phone_number: fullPhone });
      handleOtpSuccess(fullPhone, phone, "login");
    } catch (error) {
      const status = error?.response?.status;

      if (status === 404) {
        // 🔥 fallback to onboarding
        await handleOnboarding(fullPhone);
      } else if (status === 429) {
        showToast("Too many attempts. Please try again later.", "error");
      } else if (status === 400) {
        showToast("Invalid phone number.", "error");
      } else {
        showToast("Something went wrong", "error");
      }
    } finally {
      setShake(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-sm">
        <div className="mb-4 text-center flex flex-col items-center">
          <img
            src={import.meta.env.VITE_APP_LOGO_URL}
            alt={APP.name}
            className="w-28 h-auto mb-3"
          />
          <p className="text-sm text-gray-500">{APP.tagline}</p>
        </div>

        {isMismatch && (
          <Disclaimer
            message={`Looks like you're outside ${selectedCountry?.country_name}. ${APP.name} currently operates in
            ${selectedCountry?.country_name} — please use a ${selectedCountry?.country_name} mobile number.`}
            dismissible
          />
        )}

        <div className="mb-4">
          <label className="text-sm text-gray-500 mb-1 block" htmlFor="phone">
            Phone number
          </label>

          <div
            className={`mt-1 flex items-center border rounded-lg overflow-hidden
      transition-[box-shadow,border-color] duration-200 ease-in-out
      focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1
      hover:border-gray-400
      ${error ? "border-red-500 focus-within:ring-red-500" : ""}
      ${shake ? "animate-shake" : ""}
    `}
          >
            {/* Country prefix */}
            <div className="flex items-center gap-2 px-3 bg-gray-50 text-sm text-gray-700 border-r">
              <span
                className={`fi fi-${selectedCountry?.country_code?.toLowerCase()} w-5 h-4 rounded-sm`}
              />
              <span className="font-medium">{selectedCountry?.phone_code}</span>
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
              className="flex-1 p-3 text-[15px] outline-none bg-transparent"
            />
          </div>

          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <button
          onClick={handleSendOtp}
          disabled={initiateLogin.isPending}
          className="
  w-full 
  bg-primary 
  text-white 
  p-3 
  rounded-lg 
  font-medium 
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
      </div>
    </div>
  );
};

export default Login;
