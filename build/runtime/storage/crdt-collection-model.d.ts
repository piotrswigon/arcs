export interface ModelValue {
    id: string;
    rawData?: {};
    storageKey?: string;
}
export interface SerializedModelEntry {
    id: string;
    value: ModelValue;
    keys: string[];
}
export declare class CrdtCollectionModel {
    private items;
    constructor(model?: any);
    /**
     * Adds membership, `keys`, of `value` indexed by `id` to this collection.
     * Returns whether the change is effective (`id` is new to the collection,
     * or `value` is different to the value previously stored).
     */
    add(id: string, value: any, keys: string[]): boolean;
    _equals(value1: string | {}, value2: string | {}): any;
    /**
     * Removes the membership, `keys`, of the value indexed by `id` from this collection.
     * Returns whether the change is effective (the value is no longer present
     * in the collection because all of the keys have been removed).
     */
    remove(id: string, keys: string[]): boolean;
    toLiteral(): SerializedModelEntry[];
    toList(): ModelValue[];
    has(id: string): boolean;
    getKeys(id: string): string[];
    getValue(id: string): ModelValue;
    readonly size: number;
}
