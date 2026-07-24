# MarocSphere Feature Rollout — Phased Plan

Run each phase as its own opencode session: Plan mode first (Tab), review,
then Build mode. Commit and `ng build` before starting the next phase.

## Phase 0 — Foundation (do this first, everything else depends on it)
- Define core models/interfaces: Guide, Experience, Product, Booking
  (with type: 'ai-itinerary' | 'experience' | 'product'), Message,
  Conversation, Notification.
- Create services: BookingService, ChatService, NotificationService
  (signals or RxJS state), with mock/in-memory data for now (no payments,
  no backend assumed unless one already exists — check first).

## Phase 1 — Marketplace Navigation
- Tabbed state (Experiences default / Guides / Products), each tab shows
  only its own content, smooth transition between tabs, Guides filter
  functional.

## Phase 2 — Experience Details
- Full details page: images/gallery, description, included services,
  guide profile, duration, difficulty, location + live map, meeting point,
  price, reviews, rating, available dates.
- Wire View Details, Chat, and Book buttons on the experience card.

## Phase 3 — Chat Integration
- Chat page: guide profile pic, online/offline indicator, search,
  conversation list, message history, typing indicator, read receipts,
  attachment placeholder (future-ready), timestamps, notifications.
- Auto-open the correct conversation when launched from a guide or an
  experience's Chat button — no manual guide selection.

## Phase 4 — Guide Booking Workflow (AI itinerary path)
- Flow: Choose Guide → select saved AI itinerary → booking form (date,
  start time, duration, travelers, notes) → submit → status Pending.
- Guide side: "AI Generated Booking Request" card with Accept/Deny.
- Client side: confirmation message + Pending Approval status; notification
  on accept/deny.

## Phase 5 — Experience Booking Workflow
- Book Experience → form (date, time, people, notes) → submit → guide
  auto-assigned from the experience → guide sees "Experience Booking
  Request" with Accept/Deny → client sees Pending Approval.

## Phase 6 — Guide Request Filters
- Dashboard filters: All Requests / AI Generated / Experience Bookings,
  clearly distinguishing request source.

## Phase 7 — Product Details & Booking
- Product Details page: images, description, materials, process,
  category, availability, artisan profile, workshop address, contact
  (phone/email), map, reviews, rating.
- Book Product → form (pickup date/time, quantity, notes) → submit →
  artisan sees Pending Product Request with Accept/Deny.
- Contact Artisan: client choice of WhatsApp / phone / email.

## Phase 8 — Product Collection Follow-up
- Post-pickup-date trigger: "Did you collect it?" + satisfaction rating
  + review. Review appears on artisan profile and admin dashboard.

## Phase 9 — Notifications
- Wire all client/guide/artisan notification events listed in the spec
  through NotificationService from Phase 0.

## Phase 10 — Animations & UX polish
- Page/route transitions, tab-switch animation, card hover, loading
  skeletons, success animations, toasts, booking progress animation,
  modals. Do this last, once functionality is stable — polishing
  functionality that later changes shape wastes work.

## Explicitly out of scope (per spec)
- No online payment integration. Payments happen off-platform between
  client and guide/artisan.
