import { StorageProviderBase } from '../storage-provider-base.js';
import { PouchDbCollection } from './pouch-db-collection.js';
import { PouchDbStorage } from './pouch-db-storage.js';
import { PouchDbKey } from './pouch-db-key.js';
import { Type } from '../../type.js';
import PouchDB from 'pouchdb';
/**
 * Base class for PouchDb related Storage classes
 * (PouchDbVariable/PouchDbCollection)
 */
export declare abstract class PouchDbStorageProvider extends StorageProviderBase {
    /** The Storage Engine instance we were initialized with */
    protected storageEngine: PouchDbStorage;
    backingStore: PouchDbCollection | null;
    private pendingBackingStore;
    /** The PouchDbKey for this Collection */
    protected readonly pouchDbKey: PouchDbKey;
    /** The Pouch revision of the data we have stored locally */
    protected _rev: string | undefined;
    protected constructor(type: Type, storageEngine: PouchDbStorage, name: string, id: string, key: string);
    ensureBackingStore(): Promise<PouchDbCollection>;
    /**
     * The underlying type for the data.
     */
    abstract backingType(): Type;
    /**
     * The active database for this provider.
     */
    protected readonly db: PouchDB.Database;
    /**
     * Called when the remote pouchdb server updates locally.
     */
    abstract onRemoteStateSynced(doc: PouchDB.Core.ExistingDocument<{}>): void;
}
