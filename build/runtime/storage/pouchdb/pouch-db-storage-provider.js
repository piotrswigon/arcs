import { StorageProviderBase } from '../storage-provider-base.js';
import { PouchDbKey } from './pouch-db-key.js';
/**
 * Base class for PouchDb related Storage classes
 * (PouchDbVariable/PouchDbCollection)
 */
export class PouchDbStorageProvider extends StorageProviderBase {
    constructor(type, storageEngine, name, id, key) {
        super(type, name, id, key);
        // Manages backing store
        this.backingStore = null;
        this.pendingBackingStore = null;
        this.storageEngine = storageEngine;
        this.pouchDbKey = new PouchDbKey(key);
    }
    // A consequence of awaiting this function is that this.backingStore
    // is guaranteed to exist once the await completes. This is because
    // if backingStore doesn't yet exist, the assignment in the then()
    // is guaranteed to execute before anything awaiting this function.
    async ensureBackingStore() {
        if (this.backingStore) {
            return this.backingStore;
        }
        if (!this.pendingBackingStore) {
            const key = this.storageEngine.baseStorageKey(this.backingType(), this.storageKey);
            this.pendingBackingStore = this.storageEngine.baseStorageFor(this.type, key);
            this.pendingBackingStore.then(backingStore => (this.backingStore = backingStore));
        }
        return this.pendingBackingStore;
    }
    /**
     * The active database for this provider.
     */
    get db() {
        return this.storageEngine.dbForKey(this.pouchDbKey);
    }
    /**
     * Increments the local version to be one more than the maximum of
     * the local and remove versions.
     */
    bumpVersion(otherVersion) {
        this.version = Math.max(this.version, otherVersion) + 1;
    }
}
//# sourceMappingURL=pouch-db-storage-provider.js.map