# Product Backlog: Cabbo Customer App

## Consent-Based Device Switching (v2+)
- **Feature:** Allow users to switch their active session to a new device with explicit consent, logging out the previous device.
- **Context:** Currently, only one device can be logged in at a time for security. In v2, prompt the user: "You are logged in elsewhere. Continue here and log out other devices?"
- **Rationale:** This is an industry standard for transactional apps (ride-hailing, OTT, banking, etc.) to balance security and user convenience.
- **Implementation:**
  - Show a modal/dialog when backend returns ALREADY_LOGGED_IN.
  - On user consent, invalidate the old session and continue login on the new device.
  - Ensure backend idempotency and security.
- **Priority:** v2 or later (not required for launch).

---

*Add more backlog items here as your product evolves.*
