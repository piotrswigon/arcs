import { Type } from '../type.js';
import { Id } from '../id.js';
import { KeyBase } from './key-base.js';
declare type Callback = ({}: {}) => void;
/**
 * Methods that must be implemented by a Variable Storage Provider
 */
export interface VariableStorageProvider extends StorageProviderBase {
    get(): Promise<any>;
    set(value: {}, originatorId?: string, barrier?: string): Promise<void>;
    clear(originatorId?: string, barrier?: string): Promise<void>;
}
/**
 * Methods that must be implemented by a Collection Storage Provider
 */
export interface CollectionStorageProvider extends StorageProviderBase {
    toList(): Promise<any[]>;
    getMultiple(ids: string[]): Promise<any[]>;
    storeMultiple(values: {}, keys: string[], originatorId: string): Promise<void>;
    removeMultiple(items: any[], originatorId?: string): Promise<void>;
    get(id: string): Promise<any>;
    remove(id: string, keys: string[], originatorId?: string): any;
    store(value: any, keys: string[], originatorId?: string): any;
}
export interface BigCollectionStorageProvider extends StorageProviderBase {
    get(id: string): any;
    store(value: any, keys: string[], originatorId?: string): any;
    remove(id: string, keys?: string[], originatorId?: string): any;
    stream(pageSize: number, forward?: boolean): any;
    cursorNext(cursorId: number): any;
    cursorClose(cursorId: number): any;
    cursorVersion(cursorId: number): any;
    cloneFrom(handle: any): any;
    clearItemsForTesting(): void;
}
export declare abstract class StorageBase {
    protected readonly arcId: Id;
    protected _debug: boolean;
    protected constructor(arcId: Id);
    abstract construct(id: string, type: Type, keyFragment: string): Promise<StorageProviderBase>;
    abstract connect(id: string, type: Type, key: string): Promise<StorageProviderBase>;
    abstract baseStorageKey(type: Type, key: string): string;
    abstract baseStorageFor(type: Type, key: string): Promise<StorageProviderBase>;
    abstract parseStringAsKey(s: string): KeyBase;
    /**
     * Turn on debugginf for this storage provider.  Providers should
     * subclass this and react to changes in the debug value.
     */
    debug: boolean;
    /**
     * Provides graceful shutdown for tests.
     */
    shutdown(): void;
}
declare type DeltaItems = {
    value: any;
    keys?: string[];
    effective?: boolean;
}[];
export declare class ChangeEvent {
    readonly add: DeltaItems;
    readonly remove: DeltaItems;
    readonly data: any;
    readonly version: number;
    readonly originatorId: string;
    readonly barrier: string;
    constructor(args: {
        add?: DeltaItems;
        remove?: DeltaItems;
        data?: any;
        version?: number;
        originatorId?: string;
        barrier?: string;
    });
}
/**
 * Docs TBD
 */
export declare abstract class StorageProviderBase {
    private listeners;
    private nextLocalID;
    private readonly _type;
    protected readonly _storageKey: string;
    referenceMode: boolean;
    version: number | null;
    id: string;
    originalId: string | null;
    name: string;
    source: string | null;
    description: string;
    protected constructor(type: Type, name: any, id: any, key: any);
    enableReferenceMode(): void;
    readonly storageKey: string;
    generateID(): string;
    generateIDComponents(): {
        base: string;
        component: () => number;
    };
    readonly type: Type;
    on(kindStr: string, callback: Callback, target: any): void;
    off(kindStr: string, callback: Callback): void;
    /**
     * Propagate updates to change listeners.
     *
     * @param kindStr the type of event, only 'change' is supported.
     * @param details details about the change
     */
    protected _fire(kindStr: 'change', details: ChangeEvent): Promise<void>;
    _compareTo(other: StorageProviderBase): number;
    toString(handleTags: string[]): string;
    readonly apiChannelMappingId: string;
    dispose(): void;
    /**
     * @returns an object notation of this storage provider.
     */
    abstract toLiteral(): any;
    abstract cloneFrom(store: StorageProviderBase): any;
    abstract ensureBackingStore(): any;
    abstract backingStore: any;
    /** TODO */
    modelForSynchronization(): any;
}
export {};
