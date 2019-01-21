import { StorageBase } from '../storage-provider-base.js';
import { PouchDbKey } from './pouch-db-key.js';
import { Id } from '../../id.js';
import { Type } from '../../type.js';
import { PouchDbCollection } from './pouch-db-collection.js';
import { PouchDbStorageProvider } from './pouch-db-storage-provider.js';
import PouchDB from 'pouchdb';
export declare class PouchDbStorage extends StorageBase {
    /**
     * A map of the key location to the actual provider.
     * Used for replication callbacks and as a short-circuit for the connect method.
     */
    private readonly providerByLocationCache;
    private readonly baseStores;
    private readonly baseStorePromises;
    /** Global map of database types/name to Pouch Database Instances */
    private static dbLocationToInstance;
    /** Tracks replication status and allows cancellation in tests */
    private static syncHandler;
    constructor(arcId: Id);
    debug: boolean;
    /**
     * Instantiates a new key for id/type stored at keyFragment.
     */
    construct(id: string, type: Type, keyFragment: string): Promise<PouchDbStorageProvider>;
    _construct(id: string, type: Type, keyFragment: string): Promise<PouchDbStorageProvider>;
    /**
     * Connect with an existing storage key.  Returns a cached instance if available.
     * Returns null if no such storage key exists.
     */
    connect(id: string, type: Type, key: string): Promise<PouchDbStorageProvider>;
    /** Unit tests should call this in an 'after' block. */
    shutdown(): void;
    /** @inheritDoc */
    baseStorageKey(type: Type, keyString: string): string;
    /** @inheritDoc */
    baseStorageFor(type: Type, key: string): Promise<PouchDbCollection>;
    /** @inheritDoc */
    parseStringAsKey(s: string): PouchDbKey;
    /** Creates a new Variable or Collection given basic parameters */
    newProvider(type: Type, name: any, id: any, key: any): PouchDbStorageProvider;
    /** Removes everything that a test could have created. */
    static resetPouchDbStorageForTesting(): Promise<void>;
    static dumpDB(): Promise<void>;
    /**
     * Returns a database for the specific dbLocation/dbName of PouchDbKey and caches it.
     * @param key the PouchDbKey used to obtain the cache key.
     */
    dbForKey(key: PouchDbKey): PouchDB.Database;
    /**
     * Starts syncing between the remote and local Pouch databases.
     * Installs an event handler that propagates changes arriving from
     * remote to local objects using matching location IDs.
     */
    private setupSync;
}
