# Specification

## Summary
**Goal:** Enable NFT minting in the gallery with Internet Identity wallet integration, displaying principal addresses and associating minted NFTs to the authenticated user's identity.

**Planned changes:**
- Add a "Mint NFT" button in the NFT Gallery page that opens a minting modal (image selection, title, description); requires Internet Identity login
- Call the backend mint function with the authenticated caller's principal and show a success message after minting
- Display the logged-in user's principal ID and the canister's principal address as copyable fields in the NFT Gallery page
- Update the backend to store each minted NFT linked to the owner's principal ID, and expose a query to fetch NFTs by owner
- Add a "My NFTs" tab/filter in the NFT Gallery page showing only NFTs owned by the currently logged-in principal
- Display shortened owner principal and token ID on each NFT card in both "All NFTs" and "My NFTs" views
- Show full owner principal (with copy button), token ID, mint date, and an ICP dashboard explorer link in the NFT detail modal

**User-visible outcome:** Users can log in with Internet Identity, mint NFTs from the gallery, see their principal address displayed and copyable, browse all NFTs or filter to their own, and verify on-chain ownership details including token ID, mint date, and explorer link.
