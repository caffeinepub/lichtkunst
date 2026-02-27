# Specification

## Summary
**Goal:** Fix the Admin Dashboard infinite loading state that occurs after a successful Internet Identity login in production.

**Planned changes:**
- Investigate and fix the `useIsCallerAdminWithTimeout` hook (or its usage) to resolve the race condition/timeout issue causing the page to never exit the loading state
- Ensure the backend actor used for the admin check is instantiated with the authenticated identity, not anonymously
- Add proper sequencing so the `isCallerAdmin` backend call only fires once the authenticated actor is fully ready
- Replace infinite spinner behavior with a clear error message or retry option if the admin check fails or times out

**User-visible outcome:** After logging in with Internet Identity, the Admin Dashboard loads correctly and displays the admin tabs (collections, NFT items) instead of spinning indefinitely.
