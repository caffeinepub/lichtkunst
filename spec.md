# Specification

## Summary
**Goal:** Restore the Admin button and collection creation functionality in the production/live deployment of the Istvan Seidel NFT Platform.

**Planned changes:**
- Fix the Navigation component to reliably show the "Admin" link for authenticated admin users in production, ensuring no code path silently hides it.
- Fix the `useIsCallerAdminWithTimeout` and `useIsCallerAdmin` hooks so admin status is correctly detected without premature timeouts in production; show a retry button if the check fails.
- Ensure the AdminDashboard page (including `AdminCollectionForm` and NFT management tabs) renders correctly in production with no environment-specific code path blocking it.

**User-visible outcome:** Admins can see and click the Admin button in the navigation bar on the live deployment, access the dashboard, and create collections and NFTs just as in the draft version.
