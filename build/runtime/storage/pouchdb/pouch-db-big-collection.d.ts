import { BigCollectionStorageProvider } from '../storage-provider-base.js';
import { PouchDbStorageProvider } from './pouch-db-storage-provider';
export declare class PouchDbBigCollection extends PouchDbStorageProvider implements BigCollectionStorageProvider {
    constructor(type: any, storageEngine: any, name: any, id: any, key: any);
    backingType(): any;
    get(id: string): Promise<void>;
    store(value: any, keys: string[], originatorId?: string): Promise<void>;
    remove(id: string, keys: string[], originatorId?: string): Promise<void>;
    stream(pageSize: number, forward?: boolean): Promise<void>;
    cursorNext(cursorId: number): Promise<void>;
    cursorClose(cursorId: number): void;
    cursorVersion(cursorId: number): void;
    toLiteral(): void;
    cloneFrom(): void;
    clearItemsForTesting(): void;
    /**
     * Triggered when the storage key has been modified.  For now we
     * just refetch.  This is fast since the data is synced locally.
     */
    onRemoteStateSynced(doc: any): void;
}
