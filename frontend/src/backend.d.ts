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
export interface NFTCollection {
    id: string;
    name: string;
    createdAt: bigint;
    description: string;
}
export interface NFTItem {
    id: string;
    title: string;
    tokenId?: bigint;
    imageData: ExternalBlob;
    collectionId: string;
    owner?: Principal;
    minted: boolean;
    description: string;
    mintedAt?: bigint;
    price: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCollection(id: string, name: string, description: string): Promise<void>;
    addNFT(id: string, collectionId: string, title: string, description: string, imageData: ExternalBlob, price: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCollection(id: string): Promise<void>;
    deleteNFT(id: string): Promise<void>;
    getAllCollections(): Promise<Array<NFTCollection>>;
    getAllNFTs(): Promise<Array<NFTItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNFT(id: string): Promise<NFTItem | null>;
    getNFTsByCollection(collectionId: string): Promise<Array<NFTItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCollection(id: string, name: string, description: string): Promise<void>;
    updateNFT(id: string, collectionId: string, title: string, description: string, imageData: ExternalBlob, price: bigint): Promise<void>;
    uploadImage(blob: ExternalBlob): Promise<ExternalBlob>;
}
