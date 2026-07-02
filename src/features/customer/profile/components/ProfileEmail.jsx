import React, { useState, useRef, useEffect } from "react";
import { Check, CheckCircle2, Clock3, Mail, Plus, Send, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useReinitiateCustomerEmailVerification,
  useToast,
  useUpdateCustomerEmail,
} from "@/hooks";
import { isValidEmail } from "@/utils";
import { ProfileItemDetailRow } from "./ProfileItemDetailRow";

function EmailStatusBadge({ isVerified }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${
        isVerified
          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
          : "bg-amber-50 text-amber-700 ring-amber-100"
      }`}
    >
      {isVerified ? (
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
      ) : (
        <Clock3 className="h-3 w-3" aria-hidden="true" />
      )}
      {isVerified ? "Verified" : "Verification pending"}
    </span>
  );
}

function ProfileEmail({ email, isVerified, canReinitiateVerification = false }) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [draftEmail, setDraftEmail] = useState("");
  const updateEmail = useUpdateCustomerEmail();
  const reinitiateEmailVerification =
    useReinitiateCustomerEmailVerification();
  const isSaving = updateEmail.isPending || updateEmail.isLoading;
  const isResending =
    reinitiateEmailVerification.isPending ||
    reinitiateEmailVerification.isLoading;
  const trimmedEmail = draftEmail.trim();
  const canSave = isValidEmail(trimmedEmail) && !isSaving;
  const inputRef = useRef(null);
  const showResendVerification =Boolean(email) && !isVerified && canReinitiateVerification;

  const handleCancel = () => {
    setDraftEmail("");
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!trimmedEmail) {
      showToast("Please enter your email address.", "error");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    try {
      const response = await updateEmail.mutateAsync(trimmedEmail);
      queryClient.setQueryData(["customerProfile"], (oldProfile) =>
        oldProfile
          ? {
              ...oldProfile,
              email: trimmedEmail,
              is_email_verified: false,
            }
          : oldProfile,
      );
      setIsAdding(false);
      setDraftEmail("");
      showToast(
        response?.message ||
          "Email added. Please check your inbox to verify it.",
        "success",
      );
    } catch (error) {
      showToast(
        error?.response?.data?.detail ||
          "We couldn't add your email. Please try again.",
        "error",
      );
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSave();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      handleCancel();
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await reinitiateEmailVerification.mutateAsync();
      queryClient.setQueryData(["customerProfile"], (oldProfile) =>
        oldProfile
          ? {
              ...oldProfile,
              can_reinitiate_email_verification: false,
            }
          : oldProfile,
      );
      showToast(
        response?.message ||
          "Verification email sent. Please check your inbox.",
        "success",
      );
    } catch (error) {
      showToast(
        error?.response?.data?.detail ||
          "We couldn't resend the verification email. Please try again.",
        "error",
      );
    }
  };
  const handleBlur = () => {
    window.setTimeout(() => {
      if (!inputRef.current?.value.trim()) {
        handleCancel();
      }
    }, 0);
  };

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  if (email) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white px-3 py-3">
        <ProfileItemDetailRow
          icon={Mail}
          label="Email"
          value={email}
          helper={
            isVerified
              ? "Used as a secondary channel for trip and account communication."
              : showResendVerification
                ? "Check your inbox or resend the verification email."
                : "Check your inbox and verify this email to receive trip and account updates."
          }
          badge={<EmailStatusBadge isVerified={Boolean(isVerified)} />}
          className="border-0 px-0 py-0 shadow-none"
        />
        {showResendVerification && (
          <div className="mt-3 flex justify-start pl-12">
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isResending}
              className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              {isResending ? "Sending..." : "Resend verification email"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-3 py-3">
      <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary ring-1 ring-blue-100">
        <Mail className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="customer-profile-email"
            className="text-xs font-semibold uppercase text-gray-400"
          >
            Email
          </label>
          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-2.5 text-xs font-semibold text-primary transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary/15"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add email
            </button>
          )}
        </div>

        {!isAdding ? (
          <>
            <p className="mt-1 text-sm font-semibold text-gray-950 sm:text-base">
              Not added yet
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Add an email to receive trip related emails.
            </p>
          </>
        ) : (
          <div className="mt-2">
            <label htmlFor="customer-profile-email" className="sr-only">
              Email address
            </label>
            <div className="flex max-w-full items-center rounded-lg border border-gray-200 bg-gray-50 pr-1 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/15">
              <input
                id="customer-profile-email"
                type="email"
                inputMode="email"
                ref={inputRef}
                value={draftEmail}
                disabled={isSaving}
                maxLength={120}
                onChange={(event) => setDraftEmail(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className="min-w-0 flex-1 rounded-lg bg-transparent px-3 py-2 text-sm font-semibold text-gray-950 outline-none placeholder:font-normal placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-primary transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:text-gray-300"
                aria-label={isSaving ? "Saving email" : "Save email"}
              >
                <Check className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Cancel email add"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              We will send a verification link to this email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export { ProfileEmail };
