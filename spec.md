# Specification

## Summary
**Goal:** Add a collection selector to the NFT upload/mint form and reduce the Mint button size to be proportionate with other form controls.

**Planned changes:**
- Add a collection dropdown/selector field to the NFT upload form (Upload page and/or MintNFTModal) that fetches available collections from the backend and allows the user to assign the NFT to a collection before submitting
- The selected collection is passed along when creating/minting the NFT; the field is optional with a clear placeholder if nothing is selected
- Reduce the Mint button size so it is visually consistent with other buttons and form elements in the app

**User-visible outcome:** Users can now assign an NFT to an existing collection directly from the upload/mint form, and the Mint button no longer appears oversized compared to other form controls.
