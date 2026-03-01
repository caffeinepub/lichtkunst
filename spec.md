# Specification

## Summary
**Goal:** Fix admin authorization so the live principal `uorkh-nazas-r5n3p-kj44w-gwm4i-liaj3-jqjll-ws44w-7dlve-3mshw-sae` is recognized as admin in both the backend canister and the frontend hook, eliminating the "Keine Berechtigung" error.

**Planned changes:**
- In `backend/main.mo`, update the stable admin principal default to `uorkh-nazas-r5n3p-kj44w-gwm4i-liaj3-jqjll-ws44w-7dlve-3mshw-sae` and ensure `isCallerAdmin` compares `caller.toText()` against this value.
- In `backend/migration.mo`, add/update the migration `run` function to overwrite the stored admin principal with the correct value on the next canister upgrade without losing any other stable state (collections, NFT items, user profiles, minted tokens).
- In the frontend `useIsCallerAdminWithTimeout` hook, update the hardcoded fallback admin principal to `uorkh-nazas-r5n3p-kj44w-gwm4i-liaj3-jqjll-ws44w-7dlve-3mshw-sae`.
- Ensure principal comparisons in the frontend hook use `.trim().toLowerCase()` on both sides.
- Add `console.log` output in the hook showing the caller's principal, the hardcoded fallback, and the backend `isCallerAdmin` result for live diagnostics.

**User-visible outcome:** The admin user with principal `uorkh-nazas-r5n3p-kj44w-gwm4i-liaj3-jqjll-ws44w-7dlve-3mshw-sae` can access the Admin Dashboard and manage collections on the live site without seeing the "Keine Berechtigung" error.
