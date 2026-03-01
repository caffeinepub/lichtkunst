# Specification

## Summary
**Goal:** Fix the admin principal in the backend so that the correct principal `uorkh-nazas-r5n3p-kj44w-gwm4i-liaj3-jqjll-ws44w-7dlve-3mshw-sae` is recognized as admin, and add frontend diagnostic logging for admin status resolution.

**Planned changes:**
- In `backend/main.mo`, set the admin principal stable variable (or hardcoded constant) to exactly `uorkh-nazas-r5n3p-kj44w-gwm4i-liaj3-jqjll-ws44w-7dlve-3mshw-sae` and ensure `isCallerAdmin` compares `caller.toText()` against this string
- Create or update `backend/migration.mo` to overwrite the stored admin principal with the correct value during canister upgrade, preserving all other stable state (collections, NFTs, user profiles, minted tokens)
- In the frontend `useIsCallerAdminWithTimeout` hook, add console logging that outputs the caller's principal, the hardcoded fallback principal, the raw boolean result from the backend `isCallerAdmin` call, and any errors encountered

**User-visible outcome:** After redeployment, the specified principal can create and manage collections without receiving a "Keine Berechtigung" error. Browser DevTools console shows detailed admin status diagnostic output for troubleshooting.
