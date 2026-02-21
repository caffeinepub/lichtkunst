import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Blob "mo:core/Blob";
import Text "mo:core/Text";
import Nat32 "mo:core/Nat32";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";

actor {
  public type NFTMetadata = {
    title : Text;
    description : Text;
    creationDate : Int;
  };

  public type LightArtPiece = {
    id : Text;
    image : Storage.ExternalBlob;
    metadata : NFTMetadata;
  };

  public type UserProfile = {
    name : Text;
  };

  module LightArtPiece {
    public func compare(a : LightArtPiece, b : LightArtPiece) : Order.Order {
      Text.compare(a.metadata.title, b.metadata.title);
    };
  };

  // State
  let lightArtPieces = Map.empty<Text, LightArtPiece>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize authorisation and storage components
  let accessControlState = AccessControl.initState();
  include MixinStorage();
  include MixinAuthorization(accessControlState);

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // Artwork management - Admin only (portfolio owner)
  public shared ({ caller }) func uploadArtwork(image : Storage.ExternalBlob, title : Text, description : Text) : async LightArtPiece {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can upload artwork");
    };

    let metadata : NFTMetadata = {
      title;
      description;
      creationDate = Time.now();
    };

    let lightArtPiece : LightArtPiece = {
      id = title; // Use title as unique identifier
      image;
      metadata;
    };

    lightArtPieces.add(title, lightArtPiece); // Use title as unique identifier
    lightArtPiece;
  };

  // Public browsing - No authentication required
  public query func getArtwork(id : Text) : async ?LightArtPiece {
    lightArtPieces.get(id);
  };

  public query func getAllArtworks() : async [LightArtPiece] {
    lightArtPieces.values().toArray().sort();
  };
};
