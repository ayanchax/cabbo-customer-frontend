import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/layouts";
import {
  FeedbackState,
  LegalMarkdownContent,
  Loader,
  PageHeader,
} from "@/components";
import { useLegalPage } from "@/hooks";
import { useIsLoggedInQuery } from "@/hooks";

function LegalPage() {
  const {
    data: isLoggedIn,
    isLoading: isCheckingLogin,
    isError: isLoggedInError,
  } = useIsLoggedInQuery();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: page, isLoading, isError } = useLegalPage(slug);
  const canGoBack =
    typeof window !== "undefined" && window.history.state?.idx > 0;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  const LegalPageContent = (
    <div className="relative mx-auto min-h-screen max-w-full overflow-visible bg-gray-50 px-2 py-2 shadow-[0_2px_16px_0_rgba(16,30,54,0.08)] sm:max-w-screen-sm sm:rounded-xl sm:bg-white sm:px-4 sm:py-6 sm:shadow-lg md:max-w-3xl md:px-6 md:py-8 lg:max-w-5xl lg:px-8 lg:py-10 xl:mb-4 xl:w-2/3 xl:px-10 2xl:max-w-screen-2xl">
      <div className="relative z-10 px-4">
        <PageHeader
          title={page?.title || "Policy"}
          subtitle={
            page
              ? `Version ${page.version} - Effective ${page.effective_date}`
              : ""
          }
          onBack={canGoBack ? () => navigate(-1) : undefined}
          className="px-0 mb-4"
        />

        {isLoading && (
          <Loader message="Loading policy..." className="min-h-96" />
        )}

        {isError && (
          <FeedbackState
            variant="error"
            title="Could not load this page"
            message="Please try again in a moment."
            className="min-h-96"
          />
        )}

        {!isLoading && !isError && page && (
          <article className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <LegalMarkdownContent content={page.content} skipFirstHeading />
          </article>
        )}
      </div>
    </div>
  );

  if (!isCheckingLogin && (!isLoggedIn || isLoggedInError)) {
    // If the user is not logged in, we don't wrap the content in AppLayout
    return LegalPageContent;
  }

  return <AppLayout>{LegalPageContent}</AppLayout>;
}

export default LegalPage;
