import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type TokenId = Nat;

  public type NFTCollection = {
    id : Text;
    name : Text;
    description : Text;
    createdAt : Int;
  };

  public type NFTItem = {
    id : Text;
    collectionId : Text;
    title : Text;
    description : Text;
    imageData : Storage.ExternalBlob;
    price : Nat;
    owner : ?Principal;
    minted : Bool;
    mintedAt : ?Int;
    tokenId : ?Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  public type NFTMetadata = {
    title : Text;
    description : Text;
    image : Storage.ExternalBlob;
  };

  public type NFT = {
    tokenId : TokenId;
    owner : Principal;
    metadata : NFTMetadata;
    mintedAt : Int;
  };

  public type MintRequest = {
    title : Text;
    description : Text;
    image : Storage.ExternalBlob;
  };

  let collections = Map.empty<Text, NFTCollection>();
  let nfts = Map.empty<Text, NFTItem>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let issuedNFTs = Map.empty<TokenId, NFT>();
  let userNFTs = Map.empty<Principal, [TokenId]>();

  var nextTokenId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Helper: Convert Map values to Array
  func mapToArray<K, V>(map : Map.Map<K, V>) : [V] {
    map.values().toArray();
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query func getAllCollections() : async [NFTCollection] {
    mapToArray(collections);
  };

  public query func getAllNFTs() : async [NFTItem] {
    mapToArray(nfts);
  };

  public query func getNFTsByCollection(collectionId : Text) : async [NFTItem] {
    let all = mapToArray(nfts);
    all.filter(func(nft : NFTItem) : Bool {
      nft.collectionId == collectionId;
    });
  };

  public query func getNFT(id : Text) : async ?NFTItem {
    nfts.get(id);
  };

  public shared ({ caller }) func addCollection(id : Text, name : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add collections");
    };
    let collection : NFTCollection = {
      id;
      name;
      description;
      createdAt = Time.now();
    };
    collections.add(id, collection);
  };

  public shared ({ caller }) func updateCollection(id : Text, name : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update collections");
    };
    switch (collections.get(id)) {
      case (null) { Runtime.trap("Collection does not exist") };
      case (?existing) {
        let updatedCollection : NFTCollection = {
          id;
          name;
          description;
          createdAt = existing.createdAt;
        };
        collections.add(id, updatedCollection);
      };
    };
  };

  public shared ({ caller }) func deleteCollection(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete collections");
    };
    switch (collections.get(id)) {
      case (null) { Runtime.trap("Collection does not exist") };
      case (?_) {
        collections.remove(id);
        let keys = nfts.keys().toArray();
        for (key in keys.values()) {
          switch (nfts.get(key)) {
            case (null) {};
            case (?nft) {
              if (nft.collectionId == id) {
                nfts.remove(key);
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func addNFT(
    id : Text,
    collectionId : Text,
    title : Text,
    description : Text,
    imageData : Storage.ExternalBlob,
    price : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users or admins can add NFTs");
    };
    let nft : NFTItem = {
      id;
      collectionId;
      title;
      description;
      imageData;
      price;
      owner = null;
      minted = false;
      mintedAt = null;
      tokenId = null;
    };
    nfts.add(id, nft);
  };

  public shared ({ caller }) func uploadImage(blob : Storage.ExternalBlob) : async Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users or admins can upload images");
    };
    blob;
  };

  public shared ({ caller }) func updateNFT(
    id : Text,
    collectionId : Text,
    title : Text,
    description : Text,
    imageData : Storage.ExternalBlob,
    price : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update NFTs");
    };
    switch (nfts.get(id)) {
      case (null) { Runtime.trap("NFT does not exist") };
      case (?existing) {
        let updatedNFT : NFTItem = {
          id;
          collectionId;
          title;
          description;
          imageData;
          price;
          owner = existing.owner;
          minted = existing.minted;
          mintedAt = existing.mintedAt;
          tokenId = existing.tokenId;
        };
        nfts.add(id, updatedNFT);
      };
    };
  };

  public shared ({ caller }) func deleteNFT(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete NFTs");
    };
    switch (nfts.get(id)) {
      case (null) { Runtime.trap("NFT does not exist") };
      case (?_) {
        nfts.remove(id);
      };
    };
  };

  public shared ({ caller }) func mintNFT(request : MintRequest) : async TokenId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can mint NFTs");
    };
    let tokenId = nextTokenId;
    nextTokenId += 1;

    let nftMetadata : NFTMetadata = {
      title = request.title;
      description = request.description;
      image = request.image;
    };

    let nft : NFT = {
      tokenId;
      owner = caller;
      metadata = nftMetadata;
      mintedAt = Time.now();
    };

    issuedNFTs.add(tokenId, nft);

    switch (userNFTs.get(caller)) {
      case (null) {
        userNFTs.add(caller, [tokenId]);
      };
      case (?existingTokens) {
        userNFTs.add(caller, existingTokens.concat([tokenId]));
      };
    };

    tokenId;
  };

  public query func getIssuedNFT(tokenId : TokenId) : async ?NFT {
    issuedNFTs.get(tokenId);
  };

  public query ({ caller }) func listMyNFTs() : async [NFT] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list their NFTs");
    };
    switch (userNFTs.get(caller)) {
      case (null) { [] };
      case (?tokenIds) {
        let ownedNFTs = tokenIds.map(func(id) { issuedNFTs.get(id) : ?NFT }).filter(func(nft) { nft != null }).map(func(nft) { nft.unwrap() });
        ownedNFTs;
      };
    };
  };

  public query func listAllNFTs() : async [NFT] {
    mapToArray(issuedNFTs);
  };

  public query ({ caller }) func listNFTsByPrincipal(principal : Principal) : async [NFT] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be an authenticated user");
    };
    switch (userNFTs.get(principal)) {
      case (null) { [] };
      case (?tokenIds) {
        let ownedNFTs = tokenIds.map(func(id) { issuedNFTs.get(id) : ?NFT }).filter(func(nft) { nft != null }).map(func(nft) { nft.unwrap() });
        ownedNFTs;
      };
    };
  };

  public query ({ caller }) func countMyNFTs() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can count their NFTs");
    };
    switch (userNFTs.get(caller)) {
      case (null) { 0 };
      case (?tokenIds) { tokenIds.size() };
    };
  };
};
