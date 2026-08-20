import { useNavigate } from "react-router-dom";
import { DEFAULT_CURRENCY_CODE, APP, ROUTES, SERVER_ERROR_CODES} from "@/utils"
import { useOverlay } from "./useOverlay";
import { useCleanupStagedTrip, useVerifyPaymentForTrip } from "./mutation";
import { isDevMode } from "@/api";
import { ANALYTICS_EVENTS, useAnalytics } from "@/analytics";

export const useRazorPay = () => {
    const navigate = useNavigate();
    const verifyPaymentApi = useVerifyPaymentForTrip();
    const cleanupStagedTripApi = useCleanupStagedTrip();
    const { showOverlay, hideOverlay } = useOverlay();
    const { track } = useAnalytics();

    const clean = async (id) => {
        try {
            await cleanupStagedTripApi.mutateAsync(id);
        } catch (cleanupError) {
            if (isDevMode) {
                console.error("Failed to cleanup staged trip after payment verification failure:", cleanupError);
            }
        }
    }
    const handlePay = async (orderData, overlayProps, pendingConfirmationContext = {}) => {
        track(ANALYTICS_EVENTS.PAYMENT_STARTED, {
            trip_id: orderData?.trip_id,
            order_id: orderData?.order_id,
            amount: orderData?.amount,
            amount_in_lowest_unit: orderData?.amount_in_lowest_unit,
            currency: orderData?.currency,
            trip_type: pendingConfirmationContext?.tripType,
        });
        showOverlay(overlayProps);
        
        // Dynamically load Razorpay script if not already loaded
        if (!window.Razorpay) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
            await new Promise((resolve) => {
                script.onload = resolve;
            });
        }

        return new Promise((resolve, reject) => {
            //Reference: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/
            const options = {
                key: import.meta.env.VITE_RAZOR_PAY_KEY_ID, // from env
                amount: orderData.amount_in_lowest_unit, // in paise
                currency: orderData.currency || DEFAULT_CURRENCY_CODE,
                name: `${APP.name} Trip Booking`,
                description: orderData.description || "Payment for your trip booking",
                order_id: orderData.order_id, // from backend
                prefill: {
                    name: orderData.customer?.name || "",
                    email: orderData.customer?.email || "",
                    contact: orderData.customer?.contact || "",
                },
                handler: async function (response) {
                    if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
                        hideOverlay();
                        track(ANALYTICS_EVENTS.PAYMENT_FAILED, {
                            trip_id: orderData?.trip_id,
                            order_id: orderData?.order_id,
                            trip_type: pendingConfirmationContext?.tripType,
                            reason: "missing_payment_details",
                        });
                        // We do not clean up temp trip even if payment failed, since we do not call verify payment endpoint at all - and give user a chance to retry payment as long as they are in the same context.
                        // In the long run, we have a scheduled job in backend that responsibly cleans abandoned trips.
                        reject(new Error("Payment failed: Missing payment details in response."));
                        return;
                    }
                    const payload = {
                        trip_id: orderData.trip_id,
                        payment_info: {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        },
                    };
                    try {
                        const result = await verifyPaymentApi.mutateAsync(payload);
                        hideOverlay(); // Dismiss before resolving so component renders SuccessOverlay into a clean screen
                        track(ANALYTICS_EVENTS.BOOKING_CONFIRMED, {
                            booking_id: result?.data?.booking_id,
                            trip_id: orderData?.trip_id,
                            order_id: orderData?.order_id,
                            trip_type: pendingConfirmationContext?.tripType,
                        });
                        resolve(result);
                    } catch (error) {
                        if (isDevMode) {
                            console.error("Payment verification failed:", error);
                        }
                        const error_code = error?.response?.data?.error_code
                        if(error_code===SERVER_ERROR_CODES.PAYMENT_VERIFIED_WITH_PENDING_CONFIRMATION){
                            // In case of payment verified but trip could not be confirmed
                            hideOverlay();
                            track(ANALYTICS_EVENTS.PAYMENT_PENDING_CONFIRMATION, {
                                trip_id: orderData?.trip_id,
                                order_id: orderData?.order_id,
                                trip_type: pendingConfirmationContext?.tripType,
                                reason: error_code,
                            });
                            navigate(ROUTES.PAYMENT_PENDING_CONFIRMATION, {
                                replace: true,
                                state: {
                                    tripId: orderData?.trip_id || null,
                                    orderId: orderData?.order_id || null,
                                    ...pendingConfirmationContext,
                                },
                            });
                            resolve({ paymentPendingConfirmation: true });
                            return
                        }
                        // Attempt to cleanup staged trip to avoid orphaned bookings, in case of razor pay verification failure.
                        await clean(orderData.trip_id)
                        hideOverlay();
                        track(ANALYTICS_EVENTS.PAYMENT_FAILED, {
                            trip_id: orderData?.trip_id,
                            order_id: orderData?.order_id,
                            trip_type: pendingConfirmationContext?.tripType,
                            reason: error_code || "verification_failed",
                        });
                        reject(new Error("Payment verification failed. Please contact support if your payment was successful but this error persists."));
                    }
                },
                modal: {
                    ondismiss: async function () {
                        hideOverlay();
                        track(ANALYTICS_EVENTS.PAYMENT_CANCELLED, {
                            trip_id: orderData?.trip_id,
                            order_id: orderData?.order_id,
                            trip_type: pendingConfirmationContext?.tripType,
                        });
                        // We do not clean on user cancellation because user might retry even after cancelling as long as they are in same context.
                        // In the long run, we have a scheduled job in backend that responsibly cleans abandoned trips.
                        reject(new Error("Payment cancelled by user."));
                    },
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        });
    };

    return { onPay: handlePay };
}




