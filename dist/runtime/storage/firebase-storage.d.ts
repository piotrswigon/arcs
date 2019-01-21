import { StorageBase, StorageProviderBase } from './storage-provider-base';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import { KeyBase } from './key-base.js';
import { Id } from '../id.js';
import { Type } from '../type.js';
export declare function resetStorageForTesting(key: any): Promise<void>;
declare class FirebaseKey extends KeyBase {
    databaseUrl?: string;
    projectId?: string;
    apiKey?: string;
    constructor(key: string);
    base(): string;
    readonly arcId: string;
    childKeyForHandle(id: any): FirebaseKey;
    childKeyForArcInfo(): FirebaseKey;
    childKeyForSuggestions(userId: any, arcId: any): KeyBase;
    childKeyForSearch(userId: any): KeyBase;
    private buildChildKey;
    toString(): string;
}
export declare class FirebaseStorage extends StorageBase {
    private readonly apps;
    private readonly sharedStores;
    private baseStores;
    private baseStorePromises;
    constructor(arcId: Id);
    construct(id: string, type: Type, keyFragment: string): Promise<FirebaseStorageProvider>;
    connect(id: string, type: Type, key: string): Promise<FirebaseStorageProvider>;
    shutdown(): void;
    baseStorageKey(type: Type, keyString: string): string;
    baseStorageFor(type: any, key: string): Promise<FirebaseCollection>;
    parseStringAsKey(s: string): FirebaseKey;
    _join(id: string, type: Type, keyString: string, shouldExist: boolean | 'unknown', referenceMode?: boolean): Promise<FirebaseCollection | FirebaseBigCollection | FirebaseVariable>;
    static encodeKey(key: string): string;
    static decodeKey(key: string): string;
}
declare abstract class FirebaseStorageProvider extends StorageProviderBase {
    private firebaseKey;
    protected persisting: Promise<void> | null;
    protected reference: firebase.database.Reference;
    backingStore: FirebaseCollection | null;
    protected storageEngine: FirebaseStorage;
    private pendingBackingStore;
    protected constructor(type: any, storageEngine: any, id: any, reference: any, key: any);
    ensureBackingStore(): Promise<FirebaseCollection>;
    abstract backingType(): Type;
    static newProvider(type: any, storageEngine: any, id: any, reference: any, key: any, shouldExist: any): FirebaseCollection | FirebaseBigCollection | FirebaseVariable;
    _transaction(transactionFunction: any): Promise<any>;
    abstract readonly _hasLocalChanges: boolean;
    abstract _persistChangesImpl(): Promise<void>;
    _persistChanges(): Promise<void>;
}
/**
 * Models a Variable that is persisted to firebase in a
 * last-writer-wins scheme.
 *
 * Initialization: After construct/connect the variable is
 * not fully initialized, calls to `get` and `toLiteral`
 * will not complete until either:
 *  * The initial value is supplied via the firebase `.on`
 *    subscription.
 *  * A value is written to the store by a call to `set`.
 *
 * Updates from firebase: Each time an update is received
 * from firebase we update the local version and value,
 * unless there is a pending local modification (see below).
 *
 * Local modifications: When a local modification is applied
 * by a call to `set` we increment the version number,
 * mark this variable as locally modified, and start a
 * process to atomically persist the change to firebase.
 * Until this process has completed we suppress incoming
 * changes from firebase. The version that we have chosen
 * (by incrementing) may not match the final state that is
 * written to firebase (if there are concurrent changes in
 * firebase, or if we have queued up multiple local
 * modifications), but the result will always be
 * monotonically increasing.
 */
declare class FirebaseVariable extends FirebaseStorageProvider {
    private value;
    private localModified;
    private readonly initialized;
    private localKeyId;
    private pendingWrites;
    wasConnect: boolean;
    private resolveInitialized;
    private readonly valueChangeCallback;
    constructor(type: any, storageEngine: any, id: any, reference: any, firebaseKey: any, shouldExist: any);
    dispose(): void;
    backingType(): Type;
    remoteStateChanged(dataSnapshot: firebase.database.DataSnapshot): void;
    readonly _hasLocalChanges: boolean;
    _persistChangesImpl(): Promise<void>;
    readonly versionForTesting: number;
    get(): Promise<any>;
    set(value: any, originatorId?: any, barrier?: any): Promise<void>;
    clear(originatorId?: any, barrier?: any): Promise<void>;
    cloneFrom(handle: any): Promise<void>;
    modelForSynchronization(): Promise<any>;
    toLiteral(): Promise<{}>;
    fromLiteral({ version, model }: {
        version: any;
        model: any;
    }): void;
}
/**
 * Models a Collection that is persisted to firebase in scheme similar
 * to the CRDT OR-set. We don't model sets of both observed
 * and removed keys but instead we maintain a list of current keys and
 * add/remove as the corresponding operations are received. We're
 * able to do this as we only ever synchronize between the same two points
 * (the client & firebase).
 *
 * Initialization: The collection is not initialized and calls to read
 * and mutate the collection will not complete until the initial state
 * is received via the firebase `.on` subscription.
 * Note, this is different to FirebaseVariable as mutations do not cause
 * the collection to become initialized (since we do not have enough state
 * to generate events).
 *
 * Updates from firebase: Each time an update is received from firebase
 * we compare the new remote state with the previous remote state. We are
 * able to detect which entries (and the corresponding keys) that have been
 * added and removed remotely. These are filtered by a set of suppressions
 * for adds that we have previously issued and then applied to our local
 * model. Each time we receive an update from firebase, we update our local
 * version number. We align it with the remote version when possible.
 *
 * Local modifications: Additions and removal of entries (and membership
 * keys) are tracked in a local structure, `localChanges`, and a process
 * is started to persist remotely. These changes are applied to the remote
 * state and committed atomically. Any added keys are added to sets in
 * `addSuppressions` to prevent applying our own writes when they
 * are received back in a subsequent update from firebase. Each time we
 * receive a local modification we increment our local version number.
 * When we persist our changes to firebase we align it with the remote
 * version.
 */
declare class FirebaseCollection extends FirebaseStorageProvider {
    private localChanges;
    private addSuppressions;
    private model;
    private remoteState;
    private readonly initialized;
    private pendingWrites;
    private resolveInitialized;
    private localKeyId;
    private readonly valueChangeCallback;
    constructor(type: any, storageEngine: any, id: any, reference: any, firebaseKey: any);
    dispose(): void;
    backingType(): any;
    remoteStateChanged(dataSnapshot: any): void;
    readonly versionForTesting: number;
    get(id: any): any;
    removeMultiple(items: any, originatorId?: any): Promise<void>;
    remove(id: any, keys?: string[], originatorId?: any): Promise<void>;
    store(value: any, keys: any, originatorId?: any): Promise<void>;
    readonly _hasLocalChanges: boolean;
    _persistChangesImpl(): Promise<void>;
    _toList(): Promise<{
        id: any;
        value: any;
        keys: any;
    }[]>;
    modelForSynchronization(): Promise<{
        version: number;
        model: {
            id: any;
            value: any;
            keys: any;
        }[];
    }>;
    toList(): Promise<any[]>;
    getMultiple(ids: any): Promise<any>;
    storeMultiple(values: any, keys: any, originatorId?: any): Promise<void>;
    cloneFrom(handle: any): Promise<void>;
    toLiteral(): Promise<{
        version: number;
        model: import("./crdt-collection-model").SerializedModelEntry[];
    }>;
    fromLiteral({ version, model }: {
        version: any;
        model: any;
    }): void;
}
/**
 * Provides access to large collections without pulling the entire contents locally.
 *
 * get(), store() and remove() all call immediately through to the backing Firebase collection.
 * There is currently no option for bulk instantiations of these methods.
 *
 * The full collection can be read via a paginated FirebaseCursor returned by stream(). This views
 * a snapshot of the collection, locked to the version at which the cursor is created.
 *
 * To get pagination working, we need to add an index field to items as they are stored, and that
 * field must be marked for indexing in the Firebase rules:
 *
 * ```
 *    "rules": {
 *      "<storage-root>": {
 *        "$collection": {
 *          "items": {
 *            ".indexOn": ["index"]
 *          }
 *        }
 *      }
 *    }
 * ```
 */
declare class FirebaseBigCollection extends FirebaseStorageProvider {
    private cursors;
    private cursorIndex;
    constructor(type: any, storageEngine: any, id: any, reference: any, firebaseKey: any);
    backingType(): any;
    enableReferenceMode(): void;
    get(id: any): Promise<any>;
    store(value: any, keys: any, originatorId: any): Promise<void>;
    remove(id: any, keys: any, originatorId: any): Promise<void>;
    /**
     * Returns a FirebaseCursor id for paginated reads of the current version of this BigCollection.
     * The id should be passed to cursorNext() to retrive the contained entities. The cursor itself
     * is held internally by this collection so we can discard it once the stream read has completed.
     *
     * By default items are returned in order of original insertion into the collection (with the
     * caveat that items removed during a streamed read may be returned at the end). Set forward to
     * false to return items in reverse insertion order.
     */
    stream(pageSize: any, forward?: boolean): Promise<number>;
    /**
     * Calls next() on the cursor identified by cursorId. The cursor will be discarded once the end
     * of the stream has been reached.
     */
    cursorNext(cursorId: any): Promise<{
        value: any[];
        done: boolean;
    } | {
        done: boolean;
    }>;
    /** Calls close() on and discards the cursor identified by cursorId. */
    cursorClose(cursorId: any): void;
    /**
     * Returns the version at which the cursor identified by cursorId is reading.
     */
    cursorVersion(cursorId: any): number;
    _persistChangesImpl(): Promise<void>;
    readonly _hasLocalChanges: boolean;
    cloneFrom(handle: any): Promise<void>;
    toLiteral(): void;
    fromLiteral({ version, model }: {
        version: any;
        model: any;
    }): void;
}
export {};
