import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils";
import { parseUtcDate } from "@/utils";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth, useToast, useLocalStorage } from "@/hooks";

const OTPInput = {
  size: 6,
};
const Verify = () => {
  const { showToast } = useToast();

  const navigate = useNavigate();
  const { state } = useLocation();
  const { resendOtp, verifyLogin, verifyOnboarding } = useAuth();
  const { setItem } = useLocalStorage();
  const {
    phone,
    displayPhone,
    flow,
    resend_timer_data = {
      resend_after: 60,
      last_sent_time: new Date().toISOString(),
    },
  } = state || {};

  

  // Calculate remaining time for OTP resend based on last sent time and resend interval
  const last = parseUtcDate(resend_timer_data.last_sent_time).getTime();
  const now = Date.now();
  const diff = Math.floor((now - last) / 1000);
  const remaining = Math.max(resend_timer_data.resend_after - diff, 0);

  // State to manage seconds left for OTP resend, initialized with calculated remaining time on mount.
  const [secondsLeftToResendOTP, setSecondsLeft] = useState(remaining);
  const [shake, setShake] = useState(false);
  const [otp, setOtp] = useState(Array(OTPInput.size).fill("")); //Initialize OTP state as an array of OTPInput.size empty strings
  const otpValue = otp.join("");
  const isOtpComplete = otpValue.length === OTPInput.size;
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next
    if (value && index < OTPInput.size - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Allow backspace to move to previous input if current is empty and not at the first
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (secondsLeftToResendOTP <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Run every second

    return () => clearInterval(interval);
  }, [secondsLeftToResendOTP]);

  const handleResend = async () => {
    if (secondsLeftToResendOTP > 0) return;

    try {
      const response = await resendOtp.mutateAsync({ phone_number: phone });

      const newLastSent = parseUtcDate(response.data.last_sent_at).getTime();
      const now = Date.now();

      const diff = Math.floor((now - newLastSent) / 1000);
      const newRemaining = Math.max(
        response.data.resend_interval_seconds - diff,
        0,
      );

      setSecondsLeft(newRemaining);
      showToast("OTP resent successfully, check your phone.", "success");
    } catch (err) {
      console.error("Resend failed", err);
      setSecondsLeft(resend_timer_data.resend_after || 60); // Reset to default on failure to prevent spamming
      showToast("Failed to resend OTP. Please try again.", "error");
    }
  };

  const handleVerify = async () => {
    if (!isOtpComplete || isVerifying) return;

    try {
      setIsVerifying(true);

      if (flow === "login") {
        const response = await verifyLogin.mutateAsync({
          phone_number: phone,
          otp: otpValue,
        });
        if (response.data?.access_token) {
          setItem("token", response.data.access_token);
          navigate(ROUTES.HOME);
          return;
        }
        throw new Error("No access token received");
      } else {
        await verifyOnboarding.mutateAsync({
          phone_number: phone,
          otp: otpValue,
        });

        navigate(ROUTES.ONBOARD, {state:{
          phone
        }}); // next step
      }
    } catch (err) {
      console.error("OTP verification failed", err);
      setOtp(Array(OTPInput.size).fill(""));
      inputRefs.current[0]?.focus();
      setShake(true);
      setTimeout(() => setShake(false), 300);
      showToast("Invalid OTP. Please try again.", "error");
    } finally {
      setIsVerifying(false);
    }
  };
  //Auto-submit OTP when all digits are entered
  useEffect(() => {
    if (isOtpComplete) {
      const timer = setTimeout(() => {
        handleVerify();
      }, 200); // subtle delay

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpValue]);

  //Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (!state || !state.phone || !state.flow) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [state, navigate]);
  if (!state || !state.phone || !state.flow) {
  return null;
}

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div
        className={`w-full max-w-md px-6 py-8 bg-white rounded-2xl shadow-sm ${
          isVerifying ? "opacity-90" : ""
        }`}
      >
        {/* 🔙 Back */}

        <button
          onClick={() => {
            if (isVerifying) return;
            navigate(ROUTES.LOGIN);
          }}
          className={`mb-6 transition ${
            isVerifying
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-700 cursor-pointer"
          }`}
        >
          <ArrowLeft size={20} />
        </button>

        {/* 🧾 Title */}
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Verify your number
        </h1>

        {/* 📱 Subtitle */}
        <p className="text-sm text-gray-500 mb-6">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-gray-800">
            {displayPhone || phone}
          </span>{" "}
          <button
            onClick={() => {
              if (isVerifying) return;
              navigate(ROUTES.LOGIN);
            }}
            className={`ml-1 font-medium ${
              isVerifying
                ? "text-gray-300 cursor-not-allowed"
                : "text-primary hover:underline cursor-pointer"
            }`}
          >
            Change
          </button>
        </p>

        {/* 🔢 OTP Input */}
        <div
          className={`
    flex gap-2 justify-between mb-6
    ${shake ? "animate-shake" : ""}
  `}
        >
          {[...Array(OTPInput.size)].map((_, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              value={otp[i]}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`
  w-12 h-12 text-center text-lg font-medium
  border rounded-lg transition
  ${shake ? "border-red-500" : "border-gray-300"}
  focus:outline-none focus:ring-2 focus:ring-primary
`}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {/* 🔁 Resend */}
        <div className="text-sm text-gray-500 mb-6 text-center">
          Didn’t receive code?{" "}
          {secondsLeftToResendOTP > 0 ? (
            <span className="text-gray-400">
              Resend in 0:{secondsLeftToResendOTP.toString().padStart(2, "0")}s
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-primary font-medium hover:underline cursor-pointer"
            >
              Resend
            </button>
          )}
        </div>

        {/* 🚀 Continue */}

        <button
          disabled={!isOtpComplete || isVerifying}
          className={`
    w-full p-3 rounded-lg font-medium transition
    ${
      !isOtpComplete || isVerifying
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-primary text-white hover:bg-primary-hover cursor-pointer"
    }
    active:scale-[0.98]
  `}
        >
          {isVerifying ? "Verifying..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Verify;
