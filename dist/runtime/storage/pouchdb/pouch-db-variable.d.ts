/// <reference types="pouchdb-core" />
import { PouchDbStorageProvider } from './pouch-db-storage-provider';
import { PouchDbStorage } from './pouch-db-storage.js';
import { Type } from '../../type.js';
import { VariableStorageProvider } from '../storage-provider-base.js';
/**
 * Loosely defines the value object stored.
 */
interface ValueStorage {
    /** The id of this Variable */
    id: string;
    /** A reference to another storage key, used for reference mode */
    storageKey?: string;
    /** The actual value of the data */
    rawData?: {};
}
/**
 * A type definition for PouchDB to allow for direct access
 * to stored top-level fields in a doc.
 */
interface VariableStorage {
    value: ValueStorage;
    version: number;
    /** ReferenceMode state for this data */
    referenceMode: boolean;
}
/**
 * The PouchDB-based implementation of a Variable.
 */
export declare class PouchDbVariable extends PouchDbStorageProvider implements VariableStorageProvider {
    private _stored;
    private localKeyId;
    constructor(type: Type, storageEngine: PouchDbStorage, name: string, id: string, key: string);
    backingType(): Type;
    clone(): PouchDbVariable;
    cloneFrom(handle: any): Promise<void>;
    /**
     * Returns the model data in a format suitable for transport over
     * the API channel (i.e. between execution host and context).
     */
    modelForSynchronization(): Promise<any>;
    /**
     * Returns the state of this variable based as an object of the form
     * {version, model: [{id, value}]}
     */
    toLiteral(): Promise<{
        version: number;
        model: {}[];
    }>;
    /**
     * Updates the internal state of this variable with data and stores
     * the data in the underlying Pouch Database.
     */
    fromLiteral({ version, model }: {
        version: any;
        model: any;
    }): Promise<void>;
    /**
     * @return a promise containing the variable value or null if it does not exist.
     */
    get(): Promise<ValueStorage>;
    /**
     * Set the value for this variable.
     * @param value the value we want to set.  If null remove the variable from storage
     * @param originatorId TBD
     * @param barrier TBD
     */
    set(value: {}, originatorId?: string, barrier?: string): Promise<void>;
    /**
     * Clear a variable from storage.
     * @param originatorId TBD
     * @param barrier TBD
     */
    clear(originatorId?: string, barrier?: string): Promise<void>;
    /**
     * Triggered when the storage key has been modified or deleted.
     */
    onRemoteStateSynced(doc: PouchDB.Core.ExistingDocument<VariableStorage>): void;
    /**
     * Pouch stored version of _stored.  Requests the value from the
     * database.
     *
     *  - If the fetched revision does not match update the local variable.
     *  - If the value does not exist store a null value.
     * @throw on misc pouch errors.
     */
    private getStored;
    /**
     * Provides a way to apply changes to the stored value in a way that
     * will result in the stored value being written to the underlying
     * PouchDB.
     *
     * - A new entry is stored if it doesn't exists.
     * - If the existing entry is available it is fetched
     * - If revisions differ a new item is written.
     * - The storage is potentially mutated and written.
     *
     * @param variableStorageMutator allows for changing the variable.
     * @return the current value of _stored.
     */
    private getStoredAndUpdate;
}
export {};
