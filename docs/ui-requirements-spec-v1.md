# Cabbo UI Requirements (V1)

---

# 1. CUSTOMER WORKFLOW

## 1.1 Non-Functional Requirements (NFR)

### Authentication & Profile

* User can register using OTP-based phone authentication.
* User can login using OTP-based phone authentication.
* User can view and update profile details (avatar, email, basic info).
* User session is maintained securely using token-based authentication.

---

## 1.2 Core Functional Requirements

### Trip Discovery & Booking

* User can search for a trip by entering source, destination, date, and trip type.
* User can view pricing details and available cab options before booking.
* User can confirm a trip by making an advance payment (platform fee).

---

### Post-Booking Management

* User can update non-cost-impacting trip details (e.g., special requests) after booking.
* User can view trip details including booking summary and status.

---

### Trip Lifecycle Visibility

* User can view trips categorized as:

  * Upcoming
  * Ongoing
  * Completed
  * Cancelled
* User can access detailed view for each trip.

---

### Trip Cancellation & Refund

* User can cancel a trip (based on allowed conditions).
* User can view refund status for cancelled trips (if applicable).

---

### Driver Visibility

* User can view driver profile details (e.g., name, rating, vehicle info).
* Driver details are accessible before, during, or after the trip (when assigned).

---

### Support (MVP Strategy)

* User can access a “Get Help” option on a trip.
* “Get Help” displays a helpline number for direct calling.
* No ticketing or chat-based support is implemented in V1.

---

### Reviews & Feedback

* User can submit a review after trip completion.
* Review includes:

  * Trip rating
  * Overall experience
  * Structured feedback parameters
  * Optional text feedback

---

# 2. ADMIN WORKFLOW (Driver Admin - V1 Scope)

## 2.1 Non-Functional Requirements (NFR)

### Authentication

* Admin can login using email/password authentication.
* Admin onboarding is handled manually via backend (no UI onboarding).
* No profile management functionality is provided in V1.

---

## 2.2 Core Functional Requirements

### Trip Dashboard

* Admin can view a dashboard listing all trips (created and confirmed).
* Each trip displays:

  * Source and destination
  * Date of journey
  * Trip type
  * Final trip price (excluding platform fee)
  * Trip status
  * Assigned driver (if any)

---

### Pricing Visibility

* Admin sees only the **driver-payable amount** (excluding platform fee).
* Extra charges (tolls, parking, overages) are not included in displayed price.
* Admin understands that extras are paid directly to driver at trip end.

---

### Driver Assignment

* Admin can assign a driver to an unassigned trip.
* Admin can reassign a driver for an already assigned trip.

---

### Driver Onboarding (Implicit)

* If driver does not exist during assignment:

  * Admin can input driver details.
  * System auto-creates (onboards) the driver.

---

### Trip Cancellation (Operational Control)

* Admin can cancel a trip due to:

  * Driver unavailability
  * No-show
  * Operational constraints
* Cancellation triggers backend refund process (if applicable).

---

## 2.3 Explicitly Out of Scope (V1)

The following features are intentionally NOT exposed in UI:

* Viewing driver reviews
* Viewing driver earnings
* Driver CRUD operations (edit, deactivate, delete)
* Multi-role admin access (super admin, finance, support, etc.)
* Customer support/ticketing system

---

# 3. PRODUCT PRINCIPLE (V1 FOCUS)

* Primary goal: Enable seamless trip booking for customers.
* Secondary goal: Ensure reliable trip fulfillment via driver assignment.
* Operational fallback: Cancel trip and trigger refund if fulfillment fails.

---

# 4. FUTURE EXTENSIBILITY (NOT IN V1)

* Multi-role admin system (super admin, finance, support, etc.)
* Driver performance dashboards
* Customer support system (tickets/chat)
* Advanced payment handling & reconciliation
* Direct driver app

---
