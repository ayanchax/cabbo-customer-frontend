import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { withAppServer } from "./app-module-loader.mjs";

test("checking overlay is accessible and recovery details appear only after checking ends", () => withAppServer(async (server) => {
  const { InfoOverlay } = await server.ssrLoadModule("/src/components/common/InfoOverlay.jsx");
  const html = renderToStaticMarkup(createElement(InfoOverlay, {
    visible: true, message: "Checking your payment", subtext: "Please don't pay again while we check.",
  }));
  assert.match(html, /role="status"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-atomic="true"/);
  assert.match(html, /motion-safe:animate-spin/);
  assert.doesNotMatch(html, /<button|<a /);
  assert.equal(renderToStaticMarkup(createElement(InfoOverlay, { visible: false })), "");
  const { default: PendingPage } = await server.ssrLoadModule("/src/pages/PaymentPendingConfirmationPage.jsx");
  const { PaymentContext } = await server.ssrLoadModule("/src/payments/PaymentContext.js");
  const { MemoryRouter } = await import("react-router-dom");
  const { PAYMENT_PHASE } = await server.ssrLoadModule("/src/payments/constants.js");
  const renderPage = (phase) => renderToStaticMarkup(createElement(MemoryRouter, null,
    createElement(PaymentContext.Provider, { value: {
      pending: { temp_trip_id: "test-temp" }, view: { phase }, checkAgain() {}, supportContext: null,
    } }, createElement(PendingPage))));
  const checking = renderPage(PAYMENT_PHASE.CHECKING);
  assert.match(checking, /Checking your payment/);
  assert.doesNotMatch(checking, /test-temp|Upcoming Trips|Check status again|Contact support|<button|<a /);
  for (const phase of [PAYMENT_PHASE.WAITING, PAYMENT_PHASE.REVIEW, PAYMENT_PHASE.ACCESS, PAYMENT_PHASE.REFERENCE, PAYMENT_PHASE.AUTH, PAYMENT_PHASE.MISSING]) {
    const details = renderPage(phase);
    assert.match(details, /test-temp/);
    assert.match(details, /Upcoming Trips/);
    assert.doesNotMatch(details, /motion-safe:animate-spin/);
  }
  const { SuccessOverlay } = await server.ssrLoadModule("/src/components/common/SuccessOverlay.jsx");
  const success = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SuccessOverlay, {
    visible: true, message: "Booking confirmed", showCountdown: true,
    countdownLabel: "Opening your booking in", duration: 3000,
  })));
  assert.match(success, /Booking confirmed/);
  assert.match(success, /Opening your booking in<!-- --> <!-- -->3|Opening your booking in 3/);
  assert.match(success, /aria-hidden="true" class="text-white text-base/);
  assert.match(success, /motion-safe:animate-/);
  assert.equal((success.match(/role="status"/g) || []).length, 1);
}));
