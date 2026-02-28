# Specification

## Summary
**Goal:** Fix the Admin Dashboard backend connection timeout caused by a race condition between Internet Identity login and the admin status check.

**Planned changes:**
- Update `useIsCallerAdminWithTimeout` hook to only trigger the `isCallerAdmin` query after the authenticated actor is fully ready, eliminating the race condition with Internet Identity login
- Ensure the backend actor always uses the authenticated identity when the user is logged in, never falling back to anonymous identity for admin-gated calls
- Add a retry mechanism to the admin status check so at least one retry is attempted before showing a timeout error
- Update `AdminDashboard.tsx` to coordinate actor readiness with the admin check, preventing the timeout error screen from appearing during normal authenticated login flow

**User-visible outcome:** After logging in via Internet Identity, the Admin Dashboard loads successfully without showing the "Die Verbindung zum Backend hat zu lange gedauert" timeout error message.
