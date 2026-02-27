# Specification

## Summary
**Goal:** Fix the indefinitely-hanging permissions check ("Berechtigungen werden geprüft") on the Admin Dashboard so it always resolves quickly.

**Planned changes:**
- Update the AdminDashboard page to handle all authentication states (logged in, logged out, actor unavailable) without getting stuck in a loading state.
- Create a wrapper hook around `useIsCallerAdmin` that enforces a hard timeout (≤5 seconds), resolving to false/error instead of remaining pending indefinitely.
- Ensure unauthenticated users are immediately shown a redirect or error message rather than an endless spinner.
- Handle cases where the actor is unavailable or fails to initialize, surfacing an error state to the AdminDashboard page.

**User-visible outcome:** The Admin Dashboard permissions check completes within a few seconds under all conditions — admins see the dashboard, non-admins or unauthenticated users see an appropriate message or redirect, and no one gets stuck on an infinite loading screen.
