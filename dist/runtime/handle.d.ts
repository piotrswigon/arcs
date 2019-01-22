/** @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { StorageProxy, CollectionProxy, VariableProxy, BigCollectionProxy } from './storage-proxy.js';
import { Particle } from './particle.js';
export interface HandleOptions {
    keepSynced: boolean;
    notifySync: boolean;
    notifyUpdate: boolean;
    notifyDesync: boolean;
}
/**
 * Base class for Collections and Variables.
 */
export declare abstract class Handle {
    _proxy: StorageProxy;
    name: string;
    canRead: boolean;
    canWrite: boolean;
    _particleId: string | null;
    options: HandleOptions;
    entityClass: string | null;
    abstract _notify(kind: string, particle: Particle, details: {}): any;
    constructor(proxy: StorageProxy, name: string, particleId: any, canRead: boolean, canWrite: boolean);
    raiseSystemException(exception: any, method: any): void;
    configure(options: any): void;
    _serialize(entity: any): {
        id: any;
        rawData: any;
    };
    readonly type: import("./type.js").Type;
    readonly _id: string;
    toManifestString(): string;
}
/**
 * A handle on a set of Entity data. Note that, as a set, a Collection can only
 * contain a single version of an Entity for each given ID. Further, no order is
 * implied by the set. A particle's manifest dictates the types of handles that
 * need to be connected to that particle, and the current recipe identifies
 * which handles are connected.
 */
export declare class Collection extends Handle {
    _proxy: CollectionProxy;
    _notify(kind: string, particle: Particle, details: any): void;
    /**
     * Returns the Entity specified by id contained by the handle, or null if this id is not
     * contained by the handle.
     * @throws {Error} if this handle is not configured as a readable handle (i.e. 'in' or 'inout')
     * in the particle's manifest.
     */
    get(id: any): Promise<any>;
    /**
     * @returns a list of the Entities contained by the handle.
     * @throws {Error} if this handle is not configured as a readable handle (i.e. 'in' or 'inout')
     * in the particle's manifest.
     */
    toList(): Promise<any>;
    _restore(list: any): any;
    /**
     * Stores a new entity into the Handle.
     * @throws {Error} if this handle is not configured as a writeable handle (i.e. 'out' or 'inout')
     * in the particle's manifest.
     */
    store(entity: any): Promise<void>;
    /**
     * Removes all known entities from the Handle.
     * @throws {Error} if this handle is not configured as a writeable handle (i.e. 'out' or 'inout')
     * in the particle's manifest.
     */
    clear(): Promise<void>;
    /**
     * Removes an entity from the Handle.
     * @throws {Error} if this handle is not configured as a writeable handle (i.e. 'out' or 'inout')
     * in the particle's manifest.
     */
    remove(entity: any): Promise<void>;
}
/**
 * A handle on a single entity. A particle's manifest dictates
 * the types of handles that need to be connected to that particle, and
 * the current recipe identifies which handles are connected.
 */
export declare class Variable extends Handle {
    _proxy: VariableProxy;
    _notify(kind: string, particle: Particle, details: any): Promise<void>;
    /**
     * @returns the Entity contained by the Variable, or undefined if the Variable
     * is cleared.
     * @throws {Error} if this variable is not configured as a readable handle (i.e. 'in' or 'inout')
     * in the particle's manifest.
     */
    get(): Promise<any>;
    _restore(model: any): any;
    /**
     * Stores a new entity into the Variable, replacing any existing entity.
     * @throws {Error} if this variable is not configured as a writeable handle (i.e. 'out' or 'inout')
     * in the particle's manifest.
     */
    set(entity: any): Promise<void>;
    /**
     * Clears any entity currently in the Variable.
     * @throws {Error} if this variable is not configured as a writeable handle (i.e. 'out' or 'inout')
     * in the particle's manifest.
     */
    clear(): Promise<void>;
}
/**
 * Provides paginated read access to a BigCollection. Conforms to the javascript iterator protocol
 * but is not marked as iterable because next() is async, which is currently not supported by
 * implicit iteration in Javascript.
 */
declare class Cursor {
    _parent: BigCollection;
    _cursorId: number;
    constructor(parent: any, cursorId: any);
    /**
     * Returns {value: [items], done: false} while there are items still available, or {done: true}
     * when the cursor has completed reading the collection.
     */
    next(): Promise<import("./api-channel.js").CursorNextValue>;
    /**
     * Terminates the streamed read. This must be called if a cursor is no longer needed but has not
     * yet completed streaming (i.e. next() hasn't returned {done: true}).
     */
    close(): void;
}
/**
 * A handle on a large set of Entity data. Similar to Collection, except the complete set of
 * entities is not available directly; use stream() to read the full set. Particles wanting to
 * operate on BigCollections should do so in the setHandles() call, since BigCollections do not
 * trigger onHandleSync() or onHandleUpdate().
 */
export declare class BigCollection extends Handle {
    _proxy: BigCollectionProxy;
    configure(options: any): void;
    _notify(kind: string, particle: Particle, details: any): Promise<void>;
    /**
     * Stores a new entity into the Handle.
     * @throws {Error} if this handle is not configured as a writeable handle (i.e. 'out' or 'inout')
     * in the particle's manifest.
     */
    store(entity: any): Promise<void>;
    /**
     * Removes an entity from the Handle.
     * @throws {Error} if this handle is not configured as a writeable handle (i.e. 'out' or 'inout')
     * in the particle's manifest.
     */
    remove(entity: any): Promise<void>;
    /**
     * @returns a Cursor instance that iterates over the full set of entities, reading `pageSize`
     * entities at a time. The cursor views a snapshot of the collection, locked to the version
     * at which the cursor is created.
     *
     * By default items are returned in order of original insertion into the collection (with the
     * caveat that items removed during a streamed read may be returned at the end). Set `forward`
     * to false to return items in reverse insertion order.
     *
     * @throws {Error} if this variable is not configured as a readable handle (i.e. 'in' or 'inout')
     * in the particle's manifest.
     */
    stream({ pageSize, forward }: {
        pageSize: any;
        forward?: boolean;
    }): Promise<Cursor>;
}
export declare function handleFor(proxy: StorageProxy, name?: string, particleId?: string, canRead?: boolean, canWrite?: boolean): any;
export {};
