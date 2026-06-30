# Customer Profile Rationale

This document records the V1 customer profile management decision for Cabbo.

## Decision

Cabbo should keep the V1 customer profile page focused on identity,
communication, and account safety.

The frontend should not expose every backend profile endpoint in V1 simply
because the endpoint exists. The profile page should show only fields that
directly support booking, customer communication, support, and trust.

## V1 Profile Fields

Show the customer-safe profile information:

- name
- phone number
- email, if provided
- email verification status
- profile picture, if provided

Allow V1 customer actions:

- update display name
- add an email if no email exists yet
- auto-trigger email verification after adding email
- upload profile picture
- remove profile picture
- logout

Do not allow the customer to freely change the verified phone number from the
profile page in V1. Phone number is the primary authenticated identity for the
account and should remain tied to OTP/session flows.

## Email Strategy

Phone number is the primary communication and login identity. Email is a
secondary communication channel for trip confirmations, support context, and
future account notices.

During onboarding:

- phone number is mandatory and OTP verified
- name is mandatory
- email is optional

If email is provided during onboarding, Cabbo sends:

- welcome email
- email verification email

The verification email opens the frontend route:

```txt
/verify-email?ep={endpoint}&id={id}&token={token}
```

The frontend verifies the email on mount by calling the backend endpoint with
the provided query params.

If email is not provided during onboarding, the customer can add it later from
the profile page. Adding an email should trigger the same verification flow.

Once an email is added, the V1 frontend should not expose a general email-edit
flow. Email becomes a trusted secondary communication destination.  

## Deferred Fields

Do not expose these in V1:

- gender
- date of birth
- emergency contact name
- emergency contact number
- alternate 

### Why Gender And DOB Are Deferred

Gender and date of birth are not needed for Cabbo's V1 scheduled cab booking
flows. Asking for them would add unnecessary personal-data collection without a
clear customer-facing benefit. Currently only
name, phone_number and email(optional) are the PII
we collect.

Cabbo should avoid collecting profile data unless it supports booking,
communication, safety, legal, or operational needs.

### Why Emergency Contact Is Deferred

Emergency contact can be useful in future safety workflows, especially if Cabbo
adds instant rides, live tracking, SOS, or share-trip features.

For V1, Cabbo is focused on scheduled trips with support available through
phone and WhatsApp. Showing emergency-contact editing now would create a safety
promise that the product may not yet fully operationalize end to end.

Emergency contact should be introduced only when the related safety workflow is
designed, tested, and support-ready.

## Profile Picture

Profile picture is safe to support in V1 because it is a lightweight
personalization feature and can help customers recognize their own account.

The frontend can use:

```txt
POST /api/v1/customer/profile/upload/profile-picture
DELETE /api/v1/customer/profile/remove/profile-picture
```

Profile picture upload should remain optional.

## V1 UX Principle

The profile page should feel like a compact account screen, not a full
administrative form.

Recommended layout:

- avatar and customer name at the top
- verified phone number as primary identity
- email section with verified/unverified state
- profile picture edit action
- support/legal links
- logout button at the bottom

This aligns with common cab app patterns: customer profiles are minimal, with
more attention given to trips, support, payments, and safety actions.

## Backend Ownership

The backend remains responsible for:

- customer-safe DTO shape
- phone ownership and authentication
- email uniqueness and verification token generation
- email verification status
- file upload validation and storage
- authorization on every profile mutation

The frontend should provide clear controls and friendly status messages, but it
should not treat client-side state as proof of verification or identity.
