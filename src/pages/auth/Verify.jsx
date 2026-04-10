import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/routes";
import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
const OTPInput = {
  size: 6,
};
const Verify = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { phone, displayPhone, flow } = state || {};

  const [otp, setOtp] = useState(Array(OTPInput.size).fill("")); //Initialize OTP state as an array of OTPInput.size empty strings
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-2xl shadow-sm">
        {/* 🔙 Back */}
        <button
          onClick={() => navigate(routes.login)}
          className="mb-6 text-gray-500 hover:text-gray-700 transition cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        {/* 🧾 Title */}
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {flow === "onboarding" ? "Create your account" : "Verify your number"}
        </h1>

        {/* 📱 Subtitle */}
        <p className="text-sm text-gray-500 mb-6">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-gray-800">
            {displayPhone || phone}
          </span>
        </p>

        {/* 🔢 OTP Input */}
        <div className="flex gap-2 justify-between mb-6">
          {[...Array(OTPInput.size)].map((_, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              value={otp[i]}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="
        w-12 h-12 text-center text-lg font-medium
        border rounded-lg
        focus:outline-none
        focus:ring-2 focus:ring-primary
        transition
      "
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {/* 🔁 Resend */}
        <div className="text-sm text-gray-500 mb-6 text-center">
          Didn’t receive code?{" "}
          <button className="text-primary font-medium hover:underline">
            Resend
          </button>
        </div>

        {/* 🚀 Continue */}
        <button
          className="
            w-full bg-primary text-white p-3 rounded-lg font-medium
            hover:bg-primary-hover transition cursor-pointer
            active:scale-[0.98]
          "
        >
          Continue
        </button>

        {/* 🆕 Onboarding Fields (hidden for now UI-wise) */}
        {flow === "onboarding" && (
          <div className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Full name"
              className="w-full p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="email"
              placeholder="Email (optional)"
              className="w-full p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
