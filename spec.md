# Specification

## Summary
**Goal:** Hardcode a specific admin Principal ID in both the backend and frontend so that collection creation and admin dashboard access work without being blocked by existing auth checks.

**Planned changes:**
- In `backend/main.mo`, add the user's Principal ID to a hardcoded `adminPrincipals` array and update `isAdmin()`/`isCallerAdmin()` to return `true` when `msg.caller` matches any entry in that array, removing or bypassing any other checks that override this grant.
- In `backend/main.mo`, update the `createCollection` function to only throw an authorization error when `isAdmin(msg.caller)` returns `false`, and ensure it succeeds (returning the created collection) for the hardcoded admin Principal.
- In the frontend, update `useIsCallerAdminWithTimeout` (and any related admin-check hooks) to match the hardcoded admin Principal from the backend, so the Admin nav link and dashboard are immediately accessible without a timeout fallback.

**User-visible outcome:** When logged in as the hardcoded admin Principal, the Admin navigation link appears immediately and collection creation succeeds without permission errors.
