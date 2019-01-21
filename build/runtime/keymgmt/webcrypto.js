/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import idb from 'idb';
import { decode, encode } from './base64';
import rs from 'jsrsasign';
const DEVICE_KEY_ALGORITHM = 'RSA-OAEP';
const X509_CERTIFICATE_ALGORITHM = "RSA-OAEP";
const X509_CERTIFICATE_HASH_ALGORITHM = "SHA-1";
const DEVICE_KEY_HASH_ALGORITHM = "SHA-512";
const STORAGE_KEY_ALGORITHM = "AES-GCM";
const ARCS_CRYPTO_STORE_NAME = 'ArcsKeyManagementStore';
const ARCS_CRYPTO_INDEXDB_NAME = 'ArcsKeyManagement';
/**
 * A CryptoKey or CryptoKeyPair that is capable of being stored in IndexDB key storage.
 */
class WebCryptoStorableKey {
    constructor(key) {
        this.key = key;
    }
    algorithm() {
        return this.key.algorithm ? this.key.algorithm.name :
            this.key.publicKey.algorithm.name;
    }
    storableKey() {
        return this.key;
    }
}
/**
 * An AES-GCM symmetric key in raw formatted encrypted using an RSA-OAEP public key.
 * We use a symmetrically derived key for the shared secret instead of just random numbers. There are two
 * reasons for this.
 *
 * First, WebCrypto treats CryptoKeys specially in that the material is can be setup to
 * never be exposed the application, so when we generate these secrets, we can hide them from JS by declaring
 * them non-extractable or usable for wrapping or encrypting only.
 *
 * Secondly, we eventually want to move off of RSA-OAEP and use ECDH, and ECDH doesn't support encryption or wrapping
 * of randomly generated bits.
 */
class WebCryptoWrappedKey {
    constructor(wrappedKeyData, wrappedBy) {
        this.wrappedKeyData = wrappedKeyData;
        this.wrappedBy = wrappedBy;
    }
    algorithm() {
        return this.wrappedBy.algorithm();
    }
    unwrap(privKey) {
        const webPrivKey = privKey;
        return crypto.subtle.unwrapKey("raw", this.wrappedKeyData, webPrivKey.cryptoKey(), {
            name: privKey.algorithm()
        }, {
            name: STORAGE_KEY_ALGORITHM,
        }, true, ["encrypt", "decrypt"]).then(key => new WebCryptoSessionKey(key));
    }
    rewrap(privKey, pubKey) {
        return this.unwrap(privKey).then(skey => skey.disposeToWrappedKeyUsing(pubKey));
    }
    export() {
        return encode(this.wrappedKeyData.buffer);
    }
    fingerprint() {
        return Promise.resolve(encode(this.wrappedKeyData.buffer));
    }
}
/**
 * An implementation of PrivateKey using WebCrypto.
 */
class WebCryptoPrivateKey extends WebCryptoStorableKey {
    constructor(key) {
        super(key);
    }
    cryptoKey() {
        return this.storableKey();
    }
}
/**
 * An implementation of PublicKey using WebCrypto.
 */
class WebCryptoPublicKey extends WebCryptoStorableKey {
    constructor(key) {
        super(key);
    }
    cryptoKey() {
        return this.storableKey();
    }
    static digest(str) {
        return WebCryptoPublicKey.sha256(str);
    }
    static hex(buffer) {
        const hexCodes = [];
        const view = new DataView(buffer);
        for (let i = 0; i < view.byteLength; i += 4) {
            // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
            const value = view.getUint32(i);
            // toString(16) will give the hex representation of the number without padding
            const stringValue = value.toString(16);
            // We use concatenation and slice for padding
            const padding = '00000000';
            const paddedValue = (padding + stringValue).slice(-padding.length);
            hexCodes.push(paddedValue);
        }
        // Join all the hex strings into one
        return hexCodes.join("");
    }
    static sha256(str) {
        // We transform the string into an arraybuffer.
        const buffer = new Uint8Array(str.split('').map(x => x.charCodeAt(0)));
        return crypto.subtle.digest("SHA-256", buffer).then((hash) => WebCryptoPublicKey.hex(hash));
    }
    fingerprint() {
        return crypto.subtle.exportKey("jwk", this.cryptoKey())
            // Use the modulus 'n' as the fingerprint since 'e' is fixed
            .then(key => WebCryptoPublicKey.digest(key['n']));
    }
}
class WebCryptoSessionKey {
    // Visible/Used for testing only.
    decrypt(buffer, iv) {
        return crypto.subtle.decrypt({
            name: this.algorithm(),
            iv,
        }, this.sessionKey, buffer);
    }
    // Visible/Used for testing only.
    encrypt(buffer, iv) {
        return crypto.subtle.encrypt({
            name: this.algorithm(),
            iv
        }, this.sessionKey, buffer);
    }
    constructor(sessionKey) {
        this.sessionKey = sessionKey;
    }
    /**
     * This encodes the session key as a hexadecimal string.
     * TODO: this is a temporary hack for the provisioning App's QR-scanning procedure which will be
     * removed once the the key-blessing algorithm is implemented.
     */
    export() {
        return crypto.subtle.exportKey("raw", this.sessionKey).then((raw) => {
            const buf = new Uint8Array(raw);
            let res = "";
            buf.forEach((x) => res += (x < 16 ? '0' : '') + x.toString(16));
            return res;
        });
    }
    algorithm() {
        return this.sessionKey.algorithm.name;
    }
    /**
     * Encrypts this session key with the private key, and makes a best effort to destroy the session
     * key material (presumably erased during garbage collection).
     * @param pkey
     */
    disposeToWrappedKeyUsing(pkey) {
        try {
            const webPkey = pkey;
            const rawWrappedKey = crypto.subtle.wrapKey("raw", this.sessionKey, pkey.cryptoKey(), {
                name: webPkey.algorithm(),
            });
            return rawWrappedKey.then(rawKey => new WebCryptoWrappedKey(new Uint8Array(rawKey), pkey));
        }
        finally {
            // Hopefully this frees the underlying key material
            this.sessionKey = null;
        }
    }
    isDisposed() {
        return this.sessionKey != null;
    }
}
class WebCryptoDeviceKey extends WebCryptoStorableKey {
    algorithm() {
        return this.publicKey().algorithm();
    }
    constructor(key) {
        super(key);
    }
    privateKey() {
        return new WebCryptoPrivateKey(this.key.privateKey);
    }
    publicKey() {
        return new WebCryptoPublicKey(this.key.publicKey);
    }
    /**
     * Returns a fingerprint of the public key of the devicekey pair.
     */
    fingerprint() {
        return this.publicKey().fingerprint();
    }
}
/**
 * Implementation of KeyGenerator using WebCrypto interface.
 */
export class WebCryptoKeyGenerator {
    generateWrappedStorageKey(deviceKey) {
        const generatedKey = crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]);
        return generatedKey.then(key => new WebCryptoSessionKey(key))
            .then(skey => skey.disposeToWrappedKeyUsing(deviceKey.publicKey()));
    }
    static getInstance() {
        // TODO: may want to reuse instance in future
        return new WebCryptoKeyGenerator();
    }
    generateAndStoreRecoveryKey() {
        // TODO: Implement
        return Promise.reject("Not implemented");
    }
    generateDeviceKey() {
        const generatedKey = crypto.subtle.generateKey({
            hash: { name: DEVICE_KEY_HASH_ALGORITHM },
            // TODO: Note, RSA-OAEP is deprecated, we should move to ECDH in the future, but it
            // doesn't use key-wrapping, instead it uses a different mechanism: key-derivation.
            name: DEVICE_KEY_ALGORITHM,
            modulusLength: 2048,
            // exponent is only allowed to be 3 or 65537 for RSA
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        }, 
        // false means the key material is not visible to the application
        false, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]);
        return generatedKey.then(key => new WebCryptoDeviceKey(key));
    }
    /**
     * Decodes X509 PEM certificates, extracts their key material, and returns a PublicKey.
     * @param pemKey
     */
    importKey(pemKey) {
        const key = rs.KEYUTIL.getKey(pemKey);
        const jwk = rs.KEYUTIL.getJWKFromKey(key);
        return crypto.subtle.importKey("jwk", jwk, {
            name: X509_CERTIFICATE_ALGORITHM,
            hash: { name: X509_CERTIFICATE_HASH_ALGORITHM }
        }, true, ["encrypt", "wrapKey"]).then(ikey => new WebCryptoPublicKey(ikey));
    }
    importWrappedKey(wrappedKey, wrappedBy) {
        const decodedKey = decode(wrappedKey);
        return Promise.resolve(new WebCryptoWrappedKey(decodedKey, wrappedBy));
    }
}
/**
 * The Web Crypto spec states that IndexDB may be used to store CryptoKey objects without ever exposing
 * key material to the application: https://www.w3.org/TR/WebCryptoAPI/#concepts-key-storage
 */
export class WebCryptoKeyIndexedDBStorage {
    async runOnStore(fn) {
        try {
            const db = await idb.open(ARCS_CRYPTO_INDEXDB_NAME, 1, upgradeDB => upgradeDB.createObjectStore(ARCS_CRYPTO_STORE_NAME, { keyPath: "keyFingerPrint" }));
            const tx = db.transaction(ARCS_CRYPTO_STORE_NAME, 'readwrite');
            const store = tx.objectStore(ARCS_CRYPTO_STORE_NAME);
            const result = await fn(store);
            await tx.complete;
            db.close();
            return Promise.resolve(result);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async find(keyId) {
        const result = await this.runOnStore(store => {
            return store.get(keyId);
        });
        if (!result) {
            return Promise.resolve(null);
        }
        if (result.key && result.key['privateKey'] && result.key['publicKey']) {
            return Promise.resolve(new WebCryptoDeviceKey(result.key));
        }
        else if (result.key instanceof CryptoKey) {
            return Promise.resolve(new WebCryptoPublicKey(result.key));
        }
        else if (result.key instanceof Uint8Array) {
            const wrappedBy = await this.find(result.wrappingKeyFingerprint);
            return Promise.resolve(new WebCryptoWrappedKey(result.key, wrappedBy));
        }
        return Promise.reject("Unrecognized key type found in keystore.");
    }
    async write(keyFingerPrint, key) {
        if (key instanceof WebCryptoStorableKey) {
            const skey = key;
            await this.runOnStore(store => {
                return store.put({ keyFingerPrint, key: skey.storableKey() });
            });
            return keyFingerPrint;
        }
        else if (key instanceof WebCryptoWrappedKey) {
            const wrappedKey = key;
            const wrappingKeyFingerprint = await wrappedKey.wrappedBy.fingerprint();
            await this.runOnStore(store => {
                return store.put({ keyFingerPrint, key: wrappedKey.wrappedKeyData,
                    wrappingKeyFingerprint });
            });
            return keyFingerPrint;
        }
        return Promise.reject("Can't write key that isn't StorableKey or WrappedKey.");
    }
    static getInstance() {
        // TODO: If IndexDB open/close is expensive, we may want to reuse instances.
        return new WebCryptoKeyIndexedDBStorage();
    }
}
//# sourceMappingURL=webcrypto.js.map