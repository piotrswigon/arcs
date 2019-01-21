import { PouchDbStorageProvider } from './pouch-db-storage-provider';
export declare class PouchDbBigCollection extends PouchDbStorageProvider {
    constructor(type: any, storageEngine: any, name: any, id: any, key: any);
    backingType(): any;
    get(id: any): Promise<void>;
    store(value: any, keys: any, originatorId: any): Promise<void>;
    remove(id: any, keys: any, originatorId: any): Promise<void>;
    toLiteral(): void;
    cloneFrom(): void;
    /**
     * Triggered when the storage key has been modified.  For now we
     * just refetch.  This is fast since the data is synced locally.
     */
    onRemoteStateSynced(doc: any): void;
}
