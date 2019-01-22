import { CollectionStorageProvider, StorageBase, StorageProviderBase } from './storage-provider-base.js';
import { StorageProviderFactory } from './storage-provider-factory.js';
import { KeyBase } from './key-base.js';
import { Id } from '../id.js';
import { Type } from '../type.js';
import { ArcHandle } from '../synthetic-types.js';
declare enum Scope {
    arc = 1
}
declare enum Category {
    handles = 1
}
declare class SyntheticKey extends KeyBase {
    readonly scope: Scope;
    readonly category: Category;
    readonly targetKey: string;
    readonly targetType: Type;
    readonly syntheticType: Type;
    constructor(key: string, storageFactory: StorageProviderFactory);
    readonly protocol: string;
    base(): string;
    readonly arcId: string;
    childKeyForHandle(id: any): SyntheticKey;
    childKeyForArcInfo(): SyntheticKey;
    childKeyForSuggestions(userId: any, arcId: any): KeyBase;
    childKeyForSearch(userId: any): KeyBase;
    toString(): string;
}
export declare class SyntheticStorage extends StorageBase {
    private readonly storageFactory;
    constructor(arcId: Id, storageFactory: StorageProviderFactory);
    construct(id: string, type: Type, keyFragment: string): Promise<SyntheticCollection>;
    connect(id: string, type: Type, key: string): Promise<SyntheticCollection>;
    baseStorageFor(type: Type, key: string): Promise<StorageProviderBase>;
    baseStorageKey(type: Type, key: string): string;
    parseStringAsKey(s: string): SyntheticKey;
}
declare class SyntheticCollection extends StorageProviderBase implements CollectionStorageProvider {
    private readonly targetStore;
    private readonly storageFactory;
    private readonly initialized;
    private model;
    backingStore: any;
    constructor(type: any, id: any, key: any, targetStore: any, storageFactory: any);
    private process;
    toList(): Promise<ArcHandle[]>;
    toLiteral(): Promise<ArcHandle[]>;
    cloneFrom(): void;
    ensureBackingStore(): void;
    getMultiple(ids: string[]): Promise<any[]>;
    storeMultiple(values: any, keys: any, originatorId: any): Promise<void>;
    removeMultiple(items: any, originatorId: string): Promise<void>;
    get(id: string): Promise<{}>;
    remove(id: string, keys: string[], originatorId: string): void;
    store(value: any, keys: string[], originatorId?: string): void;
}
export {};
