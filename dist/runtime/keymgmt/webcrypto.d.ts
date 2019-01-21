/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { DeviceKey, Key, PublicKey, RecoveryKey, WrappedKey } from "./keys";
import { KeyGenerator, KeyStorage } from "./manager";
import { ObjectStore } from 'idb';
/**
 * Implementation of KeyGenerator using WebCrypto interface.
 */
export declare class WebCryptoKeyGenerator implements KeyGenerator {
    generateWrappedStorageKey(deviceKey: DeviceKey): PromiseLike<WrappedKey>;
    static getInstance(): WebCryptoKeyGenerator;
    generateAndStoreRecoveryKey(): PromiseLike<RecoveryKey>;
    generateDeviceKey(): PromiseLike<DeviceKey>;
    /**
     * Decodes X509 PEM certificates, extracts their key material, and returns a PublicKey.
     * @param pemKey
     */
    importKey(pemKey: string): PromiseLike<PublicKey>;
    importWrappedKey(wrappedKey: string, wrappedBy: PublicKey): Promise<WrappedKey>;
}
interface KeyRecord {
    keyFingerPrint: string;
    key: CryptoKey | CryptoKeyPair | Uint8Array;
    wrappingKeyFingerprint?: string;
}
/**
 * The Web Crypto spec states that IndexDB may be used to store CryptoKey objects without ever exposing
 * key material to the application: https://www.w3.org/TR/WebCryptoAPI/#concepts-key-storage
 */
export declare class WebCryptoKeyIndexedDBStorage implements KeyStorage {
    runOnStore<T>(fn: (store: ObjectStore<KeyRecord, IDBValidKey>) => PromiseLike<T>): Promise<T>;
    find(keyId: string): Promise<Key | null>;
    write(keyFingerPrint: string, key: DeviceKey | WrappedKey): Promise<string>;
    static getInstance(): WebCryptoKeyIndexedDBStorage;
}
export {};
