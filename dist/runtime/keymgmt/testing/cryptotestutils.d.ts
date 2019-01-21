import { KeyStorage } from "../manager";
import { DeviceKey, Key, WrappedKey } from "../keys";
export interface TestableKey {
    encrypt(buffer: ArrayBuffer, iv: Uint8Array): PromiseLike<ArrayBuffer>;
    decrypt(buffer: ArrayBuffer, iv: Uint8Array): PromiseLike<ArrayBuffer>;
}
/**
 * Implementation of KeyStorage using a Map, used for testing only.
 */
export declare class WebCryptoMemoryKeyStorage implements KeyStorage {
    storageMap: Map<string, Key>;
    constructor();
    find(keyFingerPrint: string): PromiseLike<Key | null>;
    write(keyFingerprint: string, key: DeviceKey | WrappedKey): Promise<string>;
    static getInstance(): WebCryptoMemoryKeyStorage;
}
