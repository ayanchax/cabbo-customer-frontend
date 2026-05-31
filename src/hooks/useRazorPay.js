import { DEFAULT_CURRENCY_CODE, APP } from "@/utils"
import { useVerifyPaymentForTrip, useCleanupStagedTrip } from "@/hooks";
import { isDevMode } from "@/api";

export const useRazorPay = () => {
    const verifyPaymentApi = useVerifyPaymentForTrip();
    const cleanupStagedTripApi = useCleanupStagedTrip();
    const handlePay = async (orderData) => {
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
                        resolve(result);
                    } catch (error) {
                        if (isDevMode) {
                            console.error("Payment verification failed:", error);
                        }
                        // Attempt to cleanup staged trip to avoid orphaned bookings
                        try {
                            await cleanupStagedTripApi.mutateAsync(orderData.trip_id);
                        } catch (cleanupError) {
                            if (isDevMode) {
                                console.error("Failed to cleanup staged trip after payment verification failure:", cleanupError);
                            }
                        }
                        reject(new Error("Payment verification failed. Please contact support if your payment was successful but this error persists."));
                    }
                },
                modal: {
                    ondismiss: function () {
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




