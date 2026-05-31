# Payment Integration: Razorpay (Cabbo Customer Frontend)

## Overview
This document describes how the Cabbo Customer Frontend integrates with Razorpay for secure, industry-standard payment processing. The integration follows best practices for handling sensitive payment flows in a React SPA, using backend-generated order details and the official Razorpay Checkout API.

---

## Flow Summary
1. **Trip Initiation**: User selects trip details and proceeds to payment.
2. **Order Creation (Backend)**: Backend creates a Razorpay order and returns order details to the frontend as `orderData`.
3. **Payment Modal (Frontend)**: On clicking the Pay button, the frontend invokes Razorpay Checkout using the provided order details.
4. **Payment Completion**: Razorpay returns a payment response to the frontend handler.
5. **Verification (Backend)**: Frontend sends the payment response to the backend for signature verification and trip confirmation.

---

## Razorpay Integration Details

### 1. **Order Data Structure**
The backend returns an `orderData` object containing all necessary fields:
```json
{
  "trip_id": "...",
  "order_id": "order_xxx",           // Razorpay order_id
  "amount": 119,                      // Display amount (major units)
  "amount_in_lowest_unit": 11900,     // Amount in paise (for Razorpay)
  "currency": "INR",
  "currency_symbol": "₹",
  "description": "Trip booking ...",
  "customer": {
    "id": "...",
    "name": "Ayan C",
    "email": "ayanchax9088@gmail.com",
    "contact": "+91 9831305667"
  },
  ...
}
```

### 2. **Frontend: Invoking Razorpay Checkout**
- **No extra npm package is required.**
- Dynamically load the Razorpay Checkout script if not already present.
- Use the following fields from `orderData`:
  - `order_id` → `order_id` (Razorpay)
  - `amount_in_lowest_unit` → `amount` (Razorpay, in paise)
  - `currency`
  - `customer.name`, `customer.email`, `customer.contact` → `prefill`
  - `description` → `description`
- Example handler:

```js
const handlePay = async () => {
  if (!window.Razorpay) {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    await new Promise((resolve) => { script.onload = resolve; });
  }
  const options = {
    key: "<YOUR_KEY_ID>", // Securely provided from backend/env
    amount: orderData.amount_in_lowest_unit, // paise
    currency: orderData.currency,
    name: "Cabbo Trip Booking",
    description: orderData.description,
    order_id: orderData.order_id,
    prefill: {
      name: orderData.customer.name,
      email: orderData.customer.email,
      contact: orderData.customer.contact,
    },
    handler: function (response) {
      // Send response to backend for verification
      // { ...response, trip_id: orderData.trip_id }
    },
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
};
```

### 3. **Backend: Payment Verification**
- The frontend must POST the Razorpay response (payment_id, order_id, signature) to the backend for verification.
- The backend verifies the signature and confirms the trip.
- On failure, the backend should handle cleanup (e.g., delete temp trip, notify user).

---

## Best Practices
- **Never expose your Razorpay secret key in the frontend.** Only the public key (key_id) is used.
- Always verify the payment signature on the backend before confirming the trip.
- Use HTTPS for all payment flows.
- Prefill customer details for a better user experience.
- Handle payment failures gracefully and provide clear user feedback.
- Clean up any temporary trip data if payment fails or is abandoned.

---

## References
- [Razorpay Checkout Docs](https://razorpay.com/docs/payment-gateway/web-integration/standard/)
- [Razorpay React Example (Official)](https://razorpay.com/docs/payment-gateway/web-integration/standard/react/)

---

**This approach ensures a secure, user-friendly, and industry-standard payment experience for Cabbo customers.**
