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
/**
 * Generates the 4 types of keys: Wrapped Storage Keys, DeviceKeys, RecoveryKeys, and Persona Keys.
 * Also allows importing public keys in x509 format.
 */
export interface KeyGenerator {
    generateWrappedStorageKey(deviceKey: DeviceKey): PromiseLike<WrappedKey>;
    generateDeviceKey(): PromiseLike<DeviceKey>;
    generateAndStoreRecoveryKey(): PromiseLike<RecoveryKey>;
    importKey(pem: string): PromiseLike<PublicKey>;
    importWrappedKey(wrappedKey: string, wrappedBy: PublicKey): PromiseLike<WrappedKey>;
}
/**
 * Securely stores key material (e.g. IndexDB, Android strongbox, etc)
 */
export interface KeyStorage {
    /**
     * KeyStore can persist public keys, wrapped keys, and even DeviceKeys which contain private key
     * material securely.
     * @param keyFingerPrint a string used to identify the key
     * @param key a public key, wrapped key, or device key pair.
     */
    write(keyFingerPrint: string, key: DeviceKey | WrappedKey | PublicKey): PromiseLike<string>;
    /**
     * Find a key in storage with the given fingerprint or return null if it doesn't exist.
     * @param keyFingerPrint a fingerprint from Fingerprintable.fingerprint
     */
    find(keyFingerPrint: string): PromiseLike<Key | null>;
}
export declare class KeyManager {
    static getGenerator(): KeyGenerator;
    static getStorage(): KeyStorage;
}
