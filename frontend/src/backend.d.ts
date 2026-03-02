import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type TokenId = bigint;
export interface NFTItem {
    id: NFTId;
    title: string;
    tokenId?: bigint;
    imageData: ExternalBlob;
    collectionId: CollectionId;
    owner?: Principal;
    minted: boolean;
    description: string;
    mintedAt?: bigint;
    price: bigint;
}
export interface NFT {
    tokenId: TokenId;
    owner: Principal;
    metadata: NFTMetadata;
    mintedAt: bigint;
}
export interface MintRequest {
    title: string;
    description: string;
    image: ExternalBlob;
}
export interface NFTCollection {
    id: CollectionId;
    name: string;
    createdAt: bigint;
    description: string;
}
export interface NFTMetadata {
    title: string;
    description: string;
    image: ExternalBlob;
}
export type CollectionId = string;
export type NFTId = string;
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCollection(id: CollectionId, name: string, description: string): Promise<void>;
    addNFT(id: string, collectionId: CollectionId, title: string, description: string, imageData: ExternalBlob, price: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkIsAdmin(): Promise<boolean>;
    countMyNFTs(): Promise<bigint>;
    deleteCollection(id: CollectionId): Promise<void>;
    deleteNFT(id: NFTId): Promise<void>;
    getAllCollections(): Promise<Array<NFTCollection>>;
    getAllNFTs(): Promise<Array<NFTItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getIssuedNFT(tokenId: TokenId): Promise<NFT | null>;
    getNFT(id: NFTId): Promise<NFTItem | null>;
    getNFTsByCollection(collectionId: CollectionId): Promise<Array<NFTItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllNFTs(): Promise<Array<NFT>>;
    listMyNFTs(): Promise<Array<NFT>>;
    listNFTsByPrincipal(principal: Principal): Promise<Array<NFT>>;
    mintNFT(request: MintRequest): Promise<TokenId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCollection(id: CollectionId, name: string, description: string): Promise<void>;
    updateNFT(id: string, collectionId: CollectionId, title: string, description: string, imageData: ExternalBlob, price: bigint): Promise<void>;
    uploadImage(blob: ExternalBlob): Promise<ExternalBlob>;
}
