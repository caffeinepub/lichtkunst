# Specification

## Summary
**Goal:** Fix the Admin Dashboard authentication flow so that the ICP actor and admin check are properly sequenced after Internet Identity login, eliminating the race condition that causes false "Access Denied" errors.

**Planned changes:**
- Ensure `useIsCallerAdmin` / `useIsCallerAdminWithTimeout` defers the `isCallerAdmin` call until the authenticated actor from `useActor` is fully initialized (not anonymous)
- Ensure `useActor` re-initializes the actor when the identity transitions from anonymous to authenticated, so all admin operations use the correct principal
- Show a loading spinner while the actor is initializing or the admin check is pending
- Show an "Access Denied" message only after the admin check has definitively completed and returned false (no premature flash for valid admins)
- Clear React Query caches and reset actor to anonymous identity on logout

**User-visible outcome:** A valid admin can log in with Internet Identity and immediately access the Admin Dashboard without seeing a false "Access Denied" error; a loading state is shown during initialization, and access is only denied when the check truly confirms the user is not an admin.
