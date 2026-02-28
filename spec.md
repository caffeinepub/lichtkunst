# Specification

## Summary
**Goal:** Fix the Admin button on the live production site that gets stuck in a perpetual grey/loading state due to actor connection failures or stalled admin role detection.

**Planned changes:**
- Harden the `useActor` hook (via a wrapper or utility module) to expose an `isError`/`error` state and a maximum wait threshold when the actor cannot be initialised in time
- Update `useIsCallerAdminWithTimeout` (and/or `useIsCallerAdmin`) so it always resolves to a definitive state — `done`, `timed-out`, or `error` — instead of remaining stuck in a loading phase
- Ensure dependent hooks react to an actor error state by transitioning to their own error state rather than staying in loading
- Update the Navigation component to hide the Admin button when a timeout or connection error occurs, and provide a lightweight retry mechanism so the admin can attempt to reconnect without a full page reload
- Ensure the loading/grey spinner is only shown during the bounded waiting period

**User-visible outcome:** On the live site, the Admin button either becomes clickable within a few seconds for admin users, or is hidden cleanly with a retry option if the connection cannot be established — it will no longer spin indefinitely.
