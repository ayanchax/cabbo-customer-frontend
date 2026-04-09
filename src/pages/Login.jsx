import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { initiateLogin } from "@/api";
import { showToast, isPhoneNumberValid } from "@/utils";
import { useCountry } from "@/hooks";

const Login = () => {
  const inputRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const { loading: countryLoading, selectedCountry, isMismatch } = useCountry();
  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 250); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [shake]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone || !isPhoneNumberValid(phone)) {
      // trigger shake every time
      setTimeout(() => setShake(true), 0); // trigger shake
      inputRef.current?.focus(); // focus the input field

      setError("Enter a valid 10-digit phone number"); //Phone numbers are generally 10 digits long (without country code) in most countries, including India, plus this is again checked in backend per country rules, so we can show a generic error message for all countries.
      return;
    }
    setError("");
    try {
      setLoading(true);
      await initiateLogin({ phone_number: phone });
      navigate("/verify-otp", { state: { phone } });
    } catch (error) {
      console.error("Error sending OTP:", error);
      //Show a toast notification for API failure
      showToast("Failed to send OTP", "error");
    } finally {
      setShake(false);
      setLoading(false);
    }
  };

  if (countryLoading) {
    return null; // or splash screen
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4">
        <div className="mb-4 text-center flex flex-col items-center">
          <img
            src={import.meta.env.VITE_APP_LOGO_URL}
            alt="Cabbo"
            className="w-28 h-auto mb-3"
          />
          <p className="text-sm text-gray-500">Your ride, simplified</p>
        </div>

        {isMismatch && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800">
            Cabbo currently operates in India 🇮🇳. Please use an Indian mobile
            number.
          </div>
        )}

        <div className="mb-4">
          <label className="text-sm text-gray-600" htmlFor="phone">
            Phone Number
          </label>

          <div
            className={`mt-1 flex items-center border rounded-lg overflow-hidden
      transition-[box-shadow,border-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
      focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1
      hover:border-gray-400
      ${error ? "border-red-500 focus-within:ring-red-500" : ""}
      ${shake ? "animate-shake" : ""}
    `}
          >
            {/* Country prefix */}
            <div className="flex items-center gap-2 px-3 bg-gray-50 text-sm text-gray-700 border-r">
              <span
                className={`fi fi-${selectedCountry?.country_code.toLowerCase()} w-5 h-4 rounded-sm`}
              />
              <span className="font-medium">{selectedCountry?.phone_code}</span>
            </div>

            {/* Input */}
            <input
              type="tel"
              id="phone"
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
          disabled={loading}
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
          {loading ? "Please wait..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Login;
