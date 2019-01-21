/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { SerializedModelEntry } from './storage/crdt-collection-model.js';
import { Type } from './type.js';
import { PECInnerPort, CursorNextValue } from './api-channel.js';
import { ParticleExecutionContext } from './particle-execution-context.js';
import { Particle } from './particle.js';
import { Handle, HandleOptions } from './handle.js';
declare enum SyncState {
    none = 0,
    pending = 1,
    full = 2
}
/**
 * Mediates between one or more Handles and the backing store outside the PEC.
 *
 * This can operate in two modes, based on how observing handles are configured:
 * - synchronized: the proxy maintains a copy of the full data held by the backing store, keeping
 *                 it in sync by listening to change events from the store.
 * - unsynchronized: the proxy simply passes through calls from Handles to the backing store.
 *
 * In synchronized mode we maintain a queue of sorted update events received from the backing store.
 * While events are received correctly - each update is one version ahead of our stored model - they
 * are processed immediately and observing handles are notified accordingly. If we receive an update
 * with a "future" version, the proxy is desynchronized:
 * - a request for the full data is sent to the backing store;
 * - any update events received after that (and before the response) are added to the queue;
 * - any new updates that can be applied will be (which may cause the proxy to "catch up" and resync
 *   before the full data response arrives);
 * - once the resync response is received, stale queued updates are discarded and any remaining ones
 *   are applied.
 */
export declare abstract class StorageProxy {
    static newProxy(id: string, type: Type, port: PECInnerPort, pec: ParticleExecutionContext, scheduler: any, name: string): CollectionProxy | BigCollectionProxy | VariableProxy;
    storageKey: string;
    readonly id: string;
    readonly type: Type;
    protected readonly port: PECInnerPort;
    protected readonly scheduler: StorageProxyScheduler;
    name: string;
    private baseForNewID;
    pec: ParticleExecutionContext;
    private localIDComponent;
    protected version: number | undefined;
    protected listenerAttached: boolean;
    private keepSynced;
    protected synchronized: SyncState;
    protected observers: {
        particle: Particle;
        handle: Handle;
    }[];
    private updates;
    protected barrier: string | null;
    constructor(id: string, type: Type, port: PECInnerPort, pec: ParticleExecutionContext, scheduler: any, name: string);
    abstract _getModelForSync(): any;
    abstract _synchronizeModel(version: number, model: SerializedModelEntry[]): boolean;
    abstract _processUpdate(update: {
        version: number;
    }, apply?: boolean): {};
    raiseSystemException(exception: any, methodName: any, particleId: any): void;
    /**
     *  Called by ParticleExecutionContext to associate (potentially multiple) particle/handle pairs with this proxy.
     */
    register(particle: any, handle: any): void;
    _onSynchronize({ version, model }: {
        version: number;
        model: SerializedModelEntry[];
    }): void;
    _onUpdate(update: {
        version: number;
    }): void;
    _notify(kind: any, details: any, predicate?: (ignored: HandleOptions) => boolean): void;
    _processUpdates(): void;
    generateID(): string;
    generateIDComponents(): {
        base: string;
        component: () => number;
    };
}
/**
 * Collections are synchronized in a CRDT Observed/Removed scheme.
 * Each value is identified by an ID and a set of membership keys.
 * Concurrent adds of the same value will specify the same ID but different
 * keys. A value is removed by removing all of the observed keys. A value
 * is considered to be removed if all of it's keys have been removed.
 *
 * In synchronized mode mutation takes place synchronously inside the proxy.
 * The proxy uses the originatorId to skip over redundant events sent back
 * by the storage object.
 *
 * In unsynchronized mode removal is not based on the keys observed at the
 * proxy, since the proxy does not remember the state, but instead the set
 * of keys that exist at the storage object at the time it receives the
 * request.
 */
export declare class CollectionProxy extends StorageProxy {
    private model;
    _getModelForSync(): import("./storage/crdt-collection-model.js").ModelValue[];
    _synchronizeModel(version: number, model: SerializedModelEntry[]): boolean;
    _processUpdate(update: any, apply?: boolean): {
        add?: {}[];
        remove?: {}[];
        originatorId: string;
    };
    toList(): Promise<{}[]>;
    get(id: any, particleId: any): Promise<{}>;
    store(value: any, keys: any, particleId: any): void;
    clear(particleId: any): void;
    remove(id: any, keys: any, particleId: any): void;
}
/**
 * Variables are synchronized in a 'last-writer-wins' scheme. When the
 * VariableProxy mutates the model, it sets a barrier and expects to
 * receive the barrier value echoed back in a subsequent update event.
 * Between those two points in time updates are not applied or
 * notified about as these reflect concurrent writes that did not 'win'.
 */
export declare class VariableProxy extends StorageProxy {
    model: {
        id: string;
    } | null;
    _getModelForSync(): {
        id: string;
    };
    _synchronizeModel(version: number, model: SerializedModelEntry[]): boolean;
    _processUpdate(update: any, apply?: boolean): any;
    get(): Promise<{
        id: string;
    }>;
    set(entity: any, particleId: any): void;
    clear(particleId: any): void;
}
export declare class BigCollectionProxy extends StorageProxy {
    register(particle: any, handle: any): void;
    _getModelForSync(): any;
    _processUpdate(): {};
    _synchronizeModel(): boolean;
    store(value: any, keys: any, particleId: any): Promise<void>;
    remove(id: any, particleId: any): Promise<void>;
    stream(pageSize: any, forward: any): Promise<{}>;
    cursorNext(cursorId: any): Promise<CursorNextValue>;
    cursorClose(cursorId: any): void;
}
export declare class StorageProxyScheduler {
    private _scheduled;
    private _queues;
    private _idleResolver;
    private _idle;
    constructor();
    enqueue(particle: any, handle: any, args: any): void;
    readonly busy: boolean;
    _updateIdle(): void;
    readonly idle: Promise<void>;
    _schedule(): void;
    _dispatch(): void;
}
export {};
