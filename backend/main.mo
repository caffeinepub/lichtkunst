import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
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
    price : Nat; // in e8s ICP
    owner : ?Principal;
    minted : Bool;
    mintedAt : ?Int;
    tokenId : ?Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  let collections = Map.empty<Text, NFTCollection>();
  let nfts = Map.empty<Text, NFTItem>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinStorage();
  include MixinAuthorization(accessControlState);

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // NFT Query Functions - public read access, no auth required
  public query func getAllCollections() : async [NFTCollection] {
    collections.values().toArray();
  };

  public query func getAllNFTs() : async [NFTItem] {
    nfts.values().toArray();
  };

  public query func getNFTsByCollection(collectionId : Text) : async [NFTItem] {
    nfts.values().toArray().filter(
      func(nft) {
        nft.collectionId == collectionId;
      }
    );
  };

  public query func getNFT(id : Text) : async ?NFTItem {
    nfts.get(id);
  };

  // Admin-only: add a new collection
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

  // Admin-only: update existing collection
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

  // Admin-only: delete collection and associated NFTs
  public shared ({ caller }) func deleteCollection(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete collections");
    };

    switch (collections.get(id)) {
      case (null) { Runtime.trap("Collection does not exist") };
      case (?_) {
        collections.remove(id);

        // Remove NFTs belonging to this collection
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

  // Allow users and admins to add NFTs
  public shared ({ caller }) func addNFT(id : Text, collectionId : Text, title : Text, description : Text, imageData : Storage.ExternalBlob, price : Nat) : async () {
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

  // Backend function to upload image and get URL (used by NFT admin functions)
  public shared ({ caller }) func uploadImage(blob : Storage.ExternalBlob) : async Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users or admins can upload images");
    };
    blob;
  };

  // Admin-only: update existing NFT
  public shared ({ caller }) func updateNFT(id : Text, collectionId : Text, title : Text, description : Text, imageData : Storage.ExternalBlob, price : Nat) : async () {
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

  // Admin-only: delete NFT
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
};
