import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils";
import { useAuth, useToast, useLocalStorage } from "@/hooks";
import { isValidEmail , LOCAL_STORAGE_KEYS} from "@/utils";
import { isDevMode } from "@/api";

const Onboard = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setItem } = useLocalStorage();

  const { onboardAndLogin } = useAuth();

  const nameRef = useRef(null);
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameShake, setNameShake] = useState(false);
  const [emailShake, setEmailShake] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (nameShake) {
      const timer = setTimeout(() => setNameShake(false), 250); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [nameShake]);

  useEffect(() => {
    if (emailShake) {
      const timer = setTimeout(() => setEmailShake(false), 250); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [emailShake]);

  // Guard (same pattern as Verify)
  if (!state || !state.phone) {
    navigate(ROUTES.LOGIN, { replace: true });
    return null;
  }
  const handleSubmit = async () => {
    let hasError = false;

    // Reset errors first
    setNameError("");
    setEmailError("");

    // Name validation
    if (!name.trim()) {
      setNameError("Name is required");
      setTimeout(() => setNameShake(true), 0);
      nameRef.current?.focus();
      hasError = true;
    }

    // Email validation
    if (email.trim() && !isValidEmail(email)) {
      setEmailError("Please enter a valid email");
      setTimeout(() => setEmailShake(true), 0);
      hasError = true;
    }

    // Stop here if validation fails
    if (hasError) {
      showToast("Please fix the errors before continuing.", "error");
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim() || null,
        phone_number: state.phone,
      };

      const response = await onboardAndLogin.mutateAsync(payload);
      if (response.data?.access_token) {
        setItem(LOCAL_STORAGE_KEYS.token, response.data.access_token);
        navigate(ROUTES.HOME);
        return;
      }
      throw new Error("No access token received");
    } catch (err) {
      const status = err?.response?.status || null;
      if (status === 409 && email) {
        // Conflict - user already exists with this email
        showToast(
          "An account with this email already exists. Please try with a different email.",
          "error",
        );
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
      if (isDevMode) {
        console.error("Onboarding failed", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-2xl shadow-sm">
        {/* 🧾 Title */}
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Almost there
        </h1>

        {/* ✨ Subtitle */}
        <p className="text-sm text-gray-500 mb-6">
          Just a couple of details to get started
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* 🧑 Name */}
          <div className="mb-4">
            <label htmlFor="name" className="sr-only">
              Full name
            </label>
            <div
              className={`mt-1 flex items-center border rounded-lg overflow-hidden
      transition-[box-shadow,border-color] duration-200 ease-in-out
      focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1
      hover:border-gray-400
      ${nameError ? "border-red-500 focus-within:ring-red-500" : ""}
      ${nameShake ? "animate-shake" : ""}
    `}
            >
              <input
                ref={nameRef}
                type="text"
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => {
                  setNameError("");
                  setName(e.target.value);
                }}
                autoFocus
                className="flex-1 p-3 text-[15px] outline-none bg-transparent"
              />
            </div>
            {nameError && (
              <p className="text-red-500 text-xs mt-1">{nameError}</p>
            )}
          </div>

          {/* 📧 Email (optional) */}
          <div className="mb-6">
            <label htmlFor="email" className="sr-only">
              Email (optional)
            </label>

            <div
              className={`mt-1 flex items-center border rounded-lg overflow-hidden
      transition-[box-shadow,border-color] duration-200 ease-in-out
      focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1
      hover:border-gray-400
      ${emailError ? "border-red-500 focus-within:ring-red-500" : ""}
      ${emailShake ? "animate-shake" : ""}
    `}
            >
              <input
                type="email"
                id="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => {
                  setEmailError("");
                  setEmail(e.target.value);
                }}
                className="flex-1 p-3 text-[15px] outline-none bg-transparent"
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}

            <p className="text-xs text-gray-400 mt-1">
              Get trip updates and receipts on email
            </p>
          </div>

          {/* 🚀 Continue */}
          <button
            type="submit"
            disabled={onboardAndLogin.isPending}
            className={`
            w-full p-3 disabled:cursor-not-allowed rounded-lg font-medium transition
            ${
              onboardAndLogin.isPending
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-hover cursor-pointer"
            }
            active:scale-[0.98]
          `}
          >
            {onboardAndLogin.isPending ? "Creating account..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboard;
