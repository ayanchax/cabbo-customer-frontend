# Cabbo Payment Flow

This note documents Cabbo's Razorpay Standard Checkout flow for v1 booking payments, including backend verification, recovery handling, and temp-trip cleanup hygiene.

## Goals

- Create Razorpay orders only from the backend.
- Confirm bookings only after server-side Razorpay verification succeeds.
- Preserve enough state to recover rare paid-but-unconfirmed bookings.
- Delete truly abandoned temporary trips as database hygiene.
- Refund customers after due diligence when no Cabbo booking context can be recovered but a legit payment was made as claimed by customer.

## Normal Booking Flow

1. Customer initiates booking from the frontend.
2. Backend validates the trip request and creates a `TempTrip`.
3. Backend creates a Razorpay order through `razorpay_service.py`.
4. Backend stores order metadata in `TempTrip.payment_provider_metadata`, including:
   - provider order id, for example `razorpay_order_id`
   - amount
   - currency
   - receipt
5. Backend returns the checkout payload to the frontend.
6. Frontend opens Razorpay Standard Checkout using the backend-created `order_id`.
7. On successful checkout, frontend sends the Razorpay response to Cabbo:
   - `razorpay_order_id`
   - `razorpay_payment_id`
   - `razorpay_signature`
8. Backend verifies the payment.
9. Backend marks the temp trip as payment verified.
10. Backend creates a confirmed `Trip` from the `TempTrip`.
11. Backend deletes the customer's temp trip rows after successful confirmation.

## Backend Verification Rules

Cabbo follows [Razorpay's recommended Standard Checkout](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps#1-build-integration) backend verification practices:

- Verify the Razorpay payment signature server-side.
- Use Cabbo's server-stored order id for verification, not only the client-returned order id.
- Reject the request if the client-returned `razorpay_order_id` does not match the stored order id.
- Fetch the payment from Razorpay before confirming the trip.
- Confirm all of the following before creating the `Trip`:
  - payment status is `captured`
  - payment `order_id` matches the stored order id
  - payment amount matches the expected platform fee in the lowest currency unit
  - payment currency matches Cabbo's configured currency

If any of these checks fail, booking confirmation fails and the `Trip` is not created.

## Payment-Verified Checkpoint

After Razorpay verification succeeds, Cabbo writes a durable checkpoint to `TempTrip.payment_provider_metadata` before creating the final `Trip`.

The metadata includes:

- `payment_verified: true`
- `payment_verified_via`
- `payment_verified_at`
- `razorpay_order_id`
- `razorpay_payment_id`
- `razorpay_signature`
- provider-specific payment id key, for example `razorpay_payment_id`

This checkpoint exists for one rare edge case: Razorpay verification succeeds, but Cabbo fails before the confirmed `Trip` is created due to network issue or something unexpected on the server.

## Frontend Cleanup Rules

Frontend may cleanup staged/temp trips only before a successful Razorpay handler response.

Allowed cleanup cases:

- customer cancels checkout
- payment fails before Razorpay success handler
- customer abandons booking before payment
- booking data is invalid before payment success

Frontend must not cleanup the temp trip when the backend returns `PAYMENT_VERIFIED_WITH_PENDING_CONFIRMATION` while confirming the booking. This signal means Razorpay payment verification succeeded, but Cabbo did not finish creating the confirmed `Trip`; the temp trip must be preserved so support/admin can recover it later.

## Recovery Flow

If payment verification succeeds but trip creation does not complete, frontend should show a pending-confirmation state to the customer and ask them to contact support if the booking does not appear in their trips section.

Support/admin recovery path:

1. Customer contacts support and says payment was successful but booking is pending.
2. Support verifies the customer's registered phone number.
3. Support finds the customer in Cabbo.
4. Support finds the customer's `TempTrip`.
5. Support confirms `payment_provider_metadata.payment_verified is true`.
6. Admin triggers the recovery endpoint with the temp trip id.
7. Backend re-verifies the Razorpay payment.
8. Backend promotes the `TempTrip` to a confirmed `Trip`.
9. Backend deletes the temp trip through the normal confirmation cleanup path.

Recovery endpoint:

```txt
POST /admin/trips/recovery/payment-verified-temp-trip/{temp_trip_id}
```

The endpoint is intentionally manual for v1. This edge case should be rare, and manual recovery is safer than running a scheduler that auto-promotes trips.

## Truly Missing Cabbo Records

If a customer claims money was debited, but Cabbo cannot find:

- a confirmed `Trip`
- a `TempTrip`
- payment-verified metadata
- any recoverable Cabbo order/booking context

then Cabbo should not create a trip manually.

In this case, Razorpay Dashboard/API is the source of truth. Support/finance should perform due diligence using available payment details such as:

- customer phone/email
- Razorpay payment id, if customer has it
- amount
- timestamp
- order id, if available
- bank/card/UPI reference details, if available

If Razorpay shows that the payment was captured and it cannot be tied to a recoverable Cabbo booking context, Cabbo should refund the customer if applicable and ask the customer to book again.

## Temp Trip Cleanup

Cabbo keeps `TempTrip` rows only as staging/recovery state.

The cleanup scheduler deletes expired unpaid temp trips as database hygiene.

Cleanup must skip temp trips where:

```txt
payment_provider_metadata.payment_verified == true
```

Those rows are not abandoned garbage. They are recovery records for paid-but-unconfirmed bookings and must be handled through the admin recovery path.

Current cleanup policy:

- temp trip TTL: 30 minutes
- cleanup scheduler interval: 60 minutes
- delete expired unpaid temp trips
- preserve payment-verified temp trips indefinitely until manual recovery or support action

## Webhooks

Razorpay webhooks are planned as a later/post v1 tightening step.

For v1 Standard Checkout, Cabbo's primary confirmation path remains:

```txt
frontend checkout handler -> backend verification -> Trip creation
```

When webhooks are added, they should initially be used as a reconciliation layer for events such as `payment.captured`, not as an automatic trip-confirmation mechanism.

## Operational Summary

- Normal success: verify payment, mark temp trip verified, create trip, delete temp trip.
- Verification failure: do not create trip.
- Payment verified but confirmation failed: keep temp trip and recover manually after recieving call from customer.
- Abandoned before payment success: frontend/scheduler may cleanup.
- No Cabbo record but Razorpay captured payment: refund after due diligence and ask customer to book again.
