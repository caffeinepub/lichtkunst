# Specification

## Summary
**Goal:** Fix the admin button flashing and disappearing behavior in the Navigation component on the live canister.

**Planned changes:**
- Add a hardcoded principal fallback in the Navigation component so the known admin principal always sees the Admin link, even if the backend `isCallerAdmin` call is slow or fails
- Update `useIsCallerAdmin.ts` and/or `useIsCallerAdminWithTimeout.ts` to hold the admin UI in an indeterminate/loading state during the backend call, only hiding the Admin button after a definitive `false` response or timeout
- Verify that the `isCallerAdmin` method in `backend/main.mo` is public and correctly returns `true` for the admin principal on the live canister

**User-visible outcome:** The Admin navigation link no longer flashes or disappears on page load for the admin user; it remains visible while authentication is resolved and only hides for non-admin users after a confirmed response.
