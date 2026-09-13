# Cabbo Post-Launch Focus Plan

**Launch date:** 22 August 2026  
**Current operating model:** Scheduled trips originating from Bengaluru  
**Early traction snapshot:** 32 unique customer logins, 8 total trips, 5
completed trips, and 3 upcoming trips in the first 16 days.  
**Core principle:** Finish the current small task before starting the next one.

> **Clarify → Validate → Build Trust → Acquire → Partner → Scale**

## The Focus Rule

- Work on one priority stage at a time.
- Do not start a later stage because it looks exciting.
- Complete, observe, learn and then move forward.
- Measure progress through successful trips—not activity, followers or features.

---

## Stage 1 — Clarify and Stabilise

**Start now.**

- [x] Clearly state that Cabbo currently accepts trips **originating from Bengaluru**.
- [x] Monitor the complete journey: app open → OTP → search → selection → booking → payment. Already doing it using PostHog captures throughout the app. We have this change only on the main production branch. We do not need to hammer posthog api calls in dev.
- [x] Verify confirmations, cancellations, refunds in production.
- [x] Add foundational technical SEO for the launched app: descriptive homepage metadata, canonical URL, structured service data, and environment-generated `robots.txt`/`sitemap.xml` files. Dev builds should point to `app.dev.cabbo.co.in` and block indexing; prod builds should point to `app.cabbo.co.in`.
- [x] Submit the production app to Google Search Console and inspect `https://app.cabbo.co.in/`, `robots.txt`, and `sitemap.xml` after deployment.
- [ ] Keep public organic-content work minimal until demand is clearer: route/use-case pages belong in Stage 3 after real search and booking data show what people want.
- [...] Personally observe and support the first online bookings. In progress. Already doing. So far 32 unique customers logged in, 8 trips, 5 completed trips, 3 upcoming.
- [...] Fix genuine customer friction before adding new features. Nothing reported or monitored to be fixed yet.

**Milestone:** First **5 successful online trips** completed smoothly.

---

## Stage 2 — Communicate and Build Trust

**Begin after the core journey is stable.**

- [ ] Run the bounded Bengaluru Durga Puja 2026 campaign as a manual seasonal
  demand test: poster/public page -> call or WhatsApp -> manual availability
  check -> confirmed booking in the campaign tracker -> trip completion ->
  Cabbo QR payment -> driver settlement -> reconciliation.
- [ ] Design the flex banner for the Durga Puja campaign. These 4ft flex banner will be exhibited to SBSF and BSS Durga Puja pandal visible area. We We will need 2 Flex banners exactly the same with the same content - Do not put any year or anything so that can be reused atleast for 2 years upcoming.
Ensure to write atleast something in Kannada(as exhibition is in Karnataka) in the header - may be 
Durga Puja or something. My mental model is

```text
Cabbo [Something here in Kannada with bigger fonts that is visible - so that the locals understand we respect the community we are doing business in]

Scheduled cab booking made simple.

Airport Transfers | Local Rentals | Outstation Trips
Now serving trips originating from Bengaluru

Durga Puja Special:
Pandal-hopping cab packages available

Call / WhatsApp: +91 XXXXX XXXXX
Scan to enquire or book
[QR CODE that opens our advertising campaign page with details and stuff]

Your ride simplified.
Pujor ghuraghuri, Cabbo'r sathe. [This can be may be in Bengali text too as most people will be Bengali]
```

OR 

```text
Cabbo [Something here in Kannada with bigger fonts that is visible - so that the locals understand we respect the community we are doing business in]

Scheduled cab booking made simple.

Airport Transfers | Local Rentals | Outstation Trips
Now serving trips originating from Bengaluru

Enquiries:
Call / WhatsApp: +91 XXXXX XXXXX
Bookings:
[QR CODE that opens our app]

Your ride simplified.
```

The second model is completely taking out the Durga Puja offering because - BSS has promised me to promote the social media Durga Puja campaign through their social handle way before Puja starts
because giving Puja bookings stuff in the standee during the Puja does not make sense. We will not take new bookings during Puja days as our campaign will start off in the last week of Sept and run thru second week of October only for gaining bookings, so that campaign will be run by us and also given shout outs by BSS at intervals during that period - so we do not need the first lengthy mental model.


- [...] Publish 2–3 useful posts per week—not generic promotional content. For 1 to 2 weeks. Already started.
- [x] Explain what customers can book: airport transfers, local rentals and outstation trips.
- [ ] Tell Cabbo's journey from trusted offline service to online booking.
- [ ] Publish practical Bengaluru-based trip use cases.
- [...] Use WhatsApp Status for regular visibility. Already doing
- [...] Ask completed-trip customers for genuine feedback and Google reviews.Already doing
- [...] Request referrals politely after successful trips. Already doing
- [ ] After the campaign, tag confirmed/completed campaign trips or leads with
  source `DURGA_PUJA_2026` so the learning is preserved without building a
  permanent campaign booking flow.

**Communication focus:** Clear fares, dependable scheduled travel and human support.

**Milestone:** First **10–25 online customers**, with genuine feedback and referrals.

---

## Stage 3 — Improve Discovery

**Use customer behaviour to decide what to build and promote.**

- [ ] Strengthen Cabbo's Google Business Profile and foundational SEO.
- [x] Track the routes and destinations customers search for most. Posthog is applied for that.
- [ ] Create prefilled trip-search links/cards for proven high-interest routes.
- [ ] Publish route-focused content for airport, local and outstation travel.
- [ ] Run only small, Bengaluru-targeted and measurable ad experiments.
- [ ] Test focused offline promotion through relevant communities and businesses.

**Milestone:** Identify the channels and trip types that produce real enquiries and bookings.

---

## Stage 4 — Build Distribution Partnerships

**Approach partners with a specific use case—not a generic partnership request.**

- [ ] Hotels and serviced apartments — guest and airport transport.
- [ ] Companies — employee, visitor and business travel.
- [ ] Event and wedding planners — scheduled guest movement.
- [ ] Travel agents — Bengaluru fulfilment partnership.
- [ ] Hospitals — patient and attendant transportation.
- [ ] Research and begin GoIbibo/MMT onboarding when operations are proven.
- [ ] Prepare a concise partner proposition with operating coverage and proof of service.

**Milestone:** Secure the first repeatable booking source outside Cabbo's direct network.

---

## Stage 5 — Expand and Scale

**Start only after Cabbo demonstrates repeatable demand and reliable fulfilment.**

- [ ] Attend selected Bengaluru startup, mobility and founder events.
- [ ] Build the investment story using real bookings, repeat usage and customer feedback.
- [ ] Decide which region or origin city to activate next using demand data.
- [ ] Evaluate Android/iOS store distribution.
- [ ] Prefer the smallest maintainable mobile approach before considering a full rewrite.
- [ ] Introduce instant rides only after Cabbo earns trust in scheduled travel.

**Milestone:** Proven reason to expand—supported by demand, operational capacity and data.

---

## Deliberately Not Now

- Full Expo/Flutter/native-app redevelopment.
- Large or expensive Bengaluru hoardings.
- Broad untargeted cold-email campaigns.
- Large paid-marketing spends.
- Expanding to new origins without proven demand and fulfilment readiness.
- Building features without evidence that customers need them.

---

## Weekly Founder Check

At the end of each week, answer only these questions:

1. What small priority did we complete?
2. How many searches, bookings and completed trips occurred?
3. Where did customers hesitate or drop off?
4. What did customers repeatedly ask for?
5. What is the **one most important task** for next week?

---

## North Star

> A customer discovers Cabbo, understands it, successfully books, completes the trip, trusts Cabbo and chooses or recommends it again.

Everything we do after launch must strengthen this loop.
