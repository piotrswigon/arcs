import { StorageBase, StorageProviderBase } from './storage-provider-base.js';
import { KeyBase } from './key-base.js';
import { CrdtCollectionModel } from './crdt-collection-model.js';
import { Id } from '../id.js';
import { Type } from '../type.js';
export declare function resetVolatileStorageForTesting(): void;
declare class VolatileKey extends KeyBase {
    _arcId: string;
    constructor(key: string);
    base(): string;
    arcId: string;
    childKeyForHandle(id: any): VolatileKey;
    childKeyForArcInfo(): VolatileKey;
    childKeyForSuggestions(userId: any, arcId: any): KeyBase;
    childKeyForSearch(userId: any): KeyBase;
    toString(): string;
}
export declare class VolatileStorage extends StorageBase {
    _memoryMap: {
        [index: string]: VolatileStorageProvider;
    };
    _typeMap: {
        [index: string]: VolatileCollection;
    };
    private readonly typePromiseMap;
    localIDBase: number;
    constructor(arcId: Id);
    construct(id: string, type: Type, keyFragment: string): Promise<VolatileStorageProvider>;
    _construct(id: any, type: any, keyFragment: any): Promise<VolatileCollection | VolatileBigCollection | VolatileVariable>;
    connect(id: string, type: Type, key: string): Promise<VolatileStorageProvider>;
    baseStorageKey(type: Type): string;
    baseStorageFor(type: Type, key: string): Promise<VolatileCollection>;
    parseStringAsKey(s: string): VolatileKey;
}
declare abstract class VolatileStorageProvider extends StorageProviderBase {
    backingStore: VolatileCollection | null;
    protected storageEngine: VolatileStorage;
    private pendingBackingStore;
    static newProvider(type: any, storageEngine: any, name: any, id: any, key: any): VolatileCollection | VolatileBigCollection | VolatileVariable;
    ensureBackingStore(): Promise<VolatileCollection>;
    abstract backingType(): Type;
}
declare class VolatileCollection extends VolatileStorageProvider {
    _model: CrdtCollectionModel;
    constructor(type: any, storageEngine: any, name: any, id: any, key: any);
    backingType(): any;
    clone(): VolatileCollection;
    cloneFrom(handle: any): Promise<void>;
    modelForSynchronization(): Promise<{
        version: number;
        model: any[];
    }>;
    toLiteral(): {
        version: number;
        model: import("./crdt-collection-model.js").SerializedModelEntry[];
    };
    fromLiteral({ version, model }: {
        version: any;
        model: any;
    }): void;
    _toList(): Promise<any[]>;
    toList(): Promise<any[]>;
    getMultiple(ids: any): Promise<any>;
    storeMultiple(values: any, keys: any, originatorId?: any): Promise<void>;
    get(id: any): any;
    traceInfo(): {
        items: number;
    };
    store(value: any, keys: any, originatorId?: any): Promise<void>;
    removeMultiple(items: any, originatorId?: any): Promise<void>;
    remove(id: any, keys?: string[], originatorId?: any): Promise<void>;
    clearItemsForTesting(): void;
}
declare class VolatileVariable extends VolatileStorageProvider {
    _stored: {
        id: string;
    } | null;
    private localKeyId;
    constructor(type: any, storageEngine: any, name: any, id: any, key: any);
    backingType(): Type;
    clone(): VolatileVariable;
    cloneFrom(handle: any): Promise<void>;
    modelForSynchronization(): Promise<any>;
    toLiteral(): Promise<{
        version: number;
        model: {
            id: string;
            value: {
                id: string;
            };
        }[];
    }>;
    fromLiteral({ version, model }: {
        version: any;
        model: any;
    }): void;
    traceInfo(): {
        stored: boolean;
    };
    get(): Promise<any>;
    set(value: {
        id: string;
    }, originatorId?: any, barrier?: any): Promise<void>;
    clear(originatorId?: any, barrier?: any): Promise<void>;
}
declare class VolatileBigCollection extends VolatileStorageProvider {
    private items;
    private cursors;
    private cursorIndex;
    constructor(type: any, storageEngine: any, name: any, id: any, key: any);
    enableReferenceMode(): void;
    backingType(): any;
    get(id: any): Promise<{}>;
    store(value: any, keys: any, originatorId: any): Promise<void>;
    remove(id: any, keys: any, originatorId: any): Promise<void>;
    stream(pageSize: any, forward?: boolean): Promise<number>;
    cursorNext(cursorId: any): Promise<{
        value: any;
        done: boolean;
    } | {
        done: boolean;
    }>;
    cursorClose(cursorId: any): void;
    cursorVersion(cursorId: any): number;
    cloneFrom(handle: any): Promise<void>;
    toLiteral(): {
        version: number;
        model: any[];
    };
    fromLiteral({ version, model }: {
        version: any;
        model: any;
    }): void;
    clearItemsForTesting(): void;
}
export {};
