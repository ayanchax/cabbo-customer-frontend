import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FeedbackState, Loader, SuccessOverlay } from "@/components";
import {
  useIsLoggedInQuery,
  useLocalStorage,
  useVerifyCustomerEmail,
} from "@/hooks";
import {
  APP,
  ROUTES,
  EXPECTED_EMAIL_VERIFICATION_ENDPOINT,
  LOCAL_STORAGE_KEYS,
} from "@/utils";

const EMAIL_VERIFICATION_ERROR_CODES = {
  EMAIL_ALREADY_VERIFIED: "EMAIL_ALREADY_VERIFIED",
  INVALID_VERIFICATION_LINK: "INVALID_VERIFICATION_LINK",
  EMAIL_VERIFICATION_FAILED: "EMAIL_VERIFICATION_FAILED",
};

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const { getItem } = useLocalStorage();
  const token = getItem(LOCAL_STORAGE_KEYS.token);
  const { data: isLoggedIn } = useIsLoggedInQuery(Boolean(token));
  const fallbackRoute = isLoggedIn ? ROUTES.PROFILE : ROUTES.LOGIN;
  const fallbackLabel = isLoggedIn ? "Go to profile" : "Go to login";

  const verificationParams = useMemo(
    () => ({
      ep: searchParams.get("ep") || "",
      id: searchParams.get("id") || "",
      token: searchParams.get("token") || "",
    }),
    [searchParams],
  );

  const hasRequiredParams =
    !!verificationParams.ep &&
    !!verificationParams.id &&
    !!verificationParams.token;
  const hasExpectedEndpoint =
    verificationParams.ep === EXPECTED_EMAIL_VERIFICATION_ENDPOINT;
  const canVerify = hasRequiredParams && hasExpectedEndpoint;

  const { isLoading, isSuccess, isError, error } = useVerifyCustomerEmail({
    ...verificationParams,
    enabled: canVerify,
  });

  const errorCode = error?.response?.data?.error_code;
  const isAlreadyVerified =
    errorCode === EMAIL_VERIFICATION_ERROR_CODES.EMAIL_ALREADY_VERIFIED;

  if (!hasRequiredParams) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <FeedbackState
          variant="warning"
          title="This email link is incomplete"
          message={`Please open the latest verification email from ${APP.name}. If it still does not work, you can request a fresh link from your profile.`}
          primaryAction={
            <Link
              to={fallbackRoute}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              {fallbackLabel}
            </Link>
          }
        />
      </div>
    );
  }

  if (!hasExpectedEndpoint) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <FeedbackState
          variant="warning"
          title="This email link is not valid"
          message={`Please use the latest verification email from ${APP.name}. If you requested more than one link, the older one may no longer work.`}
          primaryAction={
            <Link
              to={fallbackRoute}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              {fallbackLabel}
            </Link>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loader message="Verifying your email..." />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <SuccessOverlay visible message="Email verified" route={fallbackRoute}>
        <div className="px-4 text-center text-sm text-white/90">
          Your email is now linked to your {APP.name} account.
        </div>
      </SuccessOverlay>
    );
  }

  if (isError && isAlreadyVerified) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <FeedbackState
          variant="success"
          title="Email already verified"
          message={`This email is already verified for your ${APP.name} account. You're all set.`}
          primaryAction={
            <Link
              to={fallbackRoute}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              {fallbackLabel}
            </Link>
          }
        />
      </div>
    );
  }

  if (isError) {
    const isInvalidOrExpired =
      errorCode === EMAIL_VERIFICATION_ERROR_CODES.INVALID_VERIFICATION_LINK;
    const isVerificationFailed =
      errorCode === EMAIL_VERIFICATION_ERROR_CODES.EMAIL_VERIFICATION_FAILED;

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <FeedbackState
          variant="error"
          title={
            isInvalidOrExpired
              ? "This email link has expired"
              : "We could not verify this email"
          }
          message={
            isVerificationFailed
              ? `${APP.name} could not complete email verification right now. Please try again later, or contact support if this keeps happening.`
              : `Please request a fresh verification link from your profile. If this keeps happening, ${APP.name} support can help.`
          }
          primaryAction={
            <Link
              to={fallbackRoute}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              {fallbackLabel}
            </Link>
          }
        />
      </div>
    );
  }

  return null;
}

export default VerifyEmailPage;
