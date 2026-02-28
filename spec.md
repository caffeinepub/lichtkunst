# Specification

## Summary
**Goal:** Polish the UI with thinner borders, fix navigation labels, remove banner text overlay, fix admin access, and display the NFT canister address.

**Planned changes:**
- Reduce all border and outline widths to half their current thickness across cards, buttons, inputs, modals, and other bordered elements
- Rename the navigation label for the home/gallery route from "Galerie" to "Startseite" everywhere it appears in the UI
- Remove the "Galerie" text overlay rendered on top of the hero banner image on the Startseite page
- Fix admin access control so the authenticated admin user is correctly granted access to the Admin Dashboard (normalize principal comparison, add debug logging)
- Display the backend canister principal ID (NFT contract address) in the UI (footer or NFT Gallery page) using the PrincipalDisplay component with copy-to-clipboard support

**User-visible outcome:** The UI has thinner borders throughout, the home page nav link reads "Startseite" with no text on the hero banner, the admin user can access the Admin Dashboard without being denied, and the NFT canister address is visible and copyable in the UI.
