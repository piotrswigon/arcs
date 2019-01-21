/**
 * Implementation of KeyStorage using a Map, used for testing only.
 */
export class WebCryptoMemoryKeyStorage {
    constructor() {
        this.storageMap = new Map();
    }
    find(keyFingerPrint) {
        return Promise.resolve(this.storageMap.get(keyFingerPrint));
    }
    async write(keyFingerprint, key) {
        this.storageMap.set(keyFingerprint, key);
        return Promise.resolve(keyFingerprint);
    }
    static getInstance() {
        return new WebCryptoMemoryKeyStorage();
    }
}
//# sourceMappingURL=cryptotestutils.js.map