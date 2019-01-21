/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { ParticleSpec } from './particle-spec.js';
import { Type } from './type.js';
import { OuterPortAttachment } from './debug/outer-port-attachment.js';
import { Handle } from './handle.js';
import { Particle } from './particle.js';
import * as recipeParticle from './recipe/particle.js';
import * as recipeHandle from './recipe/handle.js';
import { Arc } from './arc.js';
import { StorageProviderBase } from './storage/storage-provider-base.js';
import { StorageProxy } from './storage-proxy.js';
import { SerializedModelEntry } from './storage/crdt-collection-model.js';
declare class ThingMapper {
    _prefix: string;
    _nextIdentifier: number;
    _idMap: Map<string, {}>;
    _reverseIdMap: Map<{}, string>;
    constructor(prefix: any);
    _newIdentifier(): string;
    createMappingForThing(thing: any, requestedId?: any): any;
    maybeCreateMappingForThing(thing: any): any;
    establishThingMapping(id: any, thing: any): Promise<void>;
    hasMappingForThing(thing: any): boolean;
    identifierForThing(thing: any): string;
    thingForIdentifier(id: any): {};
}
export declare class APIPort {
    private _port;
    _mapper: ThingMapper;
    protected _debugAttachment: OuterPortAttachment;
    protected _attachStack: boolean;
    messageCount: number;
    constructor(messagePort: any, prefix: any);
    _testingHook(): void;
    close(): void;
    _processMessage(e: any): Promise<void>;
    send(name: any, args: any): void;
}
export declare abstract class PECOuterPort extends APIPort {
    constructor(messagePort: any, arc: any);
    Stop(): void;
    DefineHandle(handle: Handle, type: Type, name: string): void;
    InstantiateParticle(particle: ParticleSpec, id: string, spec: ParticleSpec, handles: {
        [index: string]: Handle;
    }): void;
    UIEvent(particle: recipeParticle.Particle, slotName: string, event: {}): void;
    SimpleCallback(callback: number, data: {}): void;
    AwaitIdle(version: number): void;
    StartRender(particle: recipeParticle.Particle, slotName: string, providedSlots: {
        [index: string]: string;
    }, contentTypes: string[]): void;
    StopRender(particle: recipeParticle.Particle, slotName: string): void;
    abstract onRender(particle: recipeParticle.Particle, slotName: string, content: string): any;
    abstract onInitializeProxy(handle: StorageProviderBase, callback: number): any;
    abstract onSynchronizeProxy(handle: StorageProviderBase, callback: number): any;
    abstract onHandleGet(handle: StorageProviderBase, callback: number): any;
    abstract onHandleToList(handle: StorageProviderBase, callback: number): any;
    abstract onHandleSet(handle: StorageProviderBase, data: {}, particleId: string, barrier: string): any;
    abstract onHandleClear(handle: StorageProviderBase, particleId: string, barrier: string): any;
    abstract onHandleStore(handle: StorageProviderBase, callback: number, data: {
        value: {};
        keys: string[];
    }, particleId: string): any;
    abstract onHandleRemove(handle: StorageProviderBase, callback: number, data: {}, particleId: string): any;
    abstract onHandleRemoveMultiple(handle: StorageProviderBase, callback: number, data: {}, particleId: string): any;
    abstract onHandleStream(handle: StorageProviderBase, callback: number, pageSize: number, forward: boolean): any;
    abstract onStreamCursorNext(handle: StorageProviderBase, callback: number, cursorId: string): any;
    abstract onStreamCursorClose(handle: StorageProviderBase, cursorId: string): any;
    abstract onIdle(version: number, relevance: Map<recipeParticle.Particle, number[]>): any;
    abstract onGetBackingStore(callback: number, storageKey: string, type: Type): any;
    GetBackingStoreCallback(store: StorageProviderBase, callback: number, type: Type, name: string, id: string, storageKey: string): void;
    abstract onConstructInnerArc(callback: number, particle: recipeParticle.Particle): any;
    ConstructArcCallback(callback: number, arc: {}): void;
    abstract onArcCreateHandle(callback: number, arc: {}, type: Type, name: string): any;
    CreateHandleCallback(handle: StorageProviderBase, callback: number, type: Type, name: string, id: string): void;
    abstract onArcMapHandle(callback: number, arc: Arc, handle: recipeHandle.Handle): any;
    MapHandleCallback(newHandle: {}, callback: number, id: string): void;
    abstract onArcCreateSlot(callback: number, arc: Arc, transformationParticle: recipeParticle.Particle, transformationSlotName: string, handleId: string): any;
    CreateSlotCallback(slot: {}, callback: number, hostedSlotId: string): void;
    InnerArcRender(transformationParticle: recipeParticle.Particle, transformationSlotName: string, hostedSlotId: string, content: {}): void;
    abstract onArcLoadRecipe(arc: Arc, recipe: string, callback: number): any;
    abstract onRaiseSystemException(exception: {}, methodName: string, particleId: string): any;
    DevToolsConnected(): void;
}
export interface CursorNextValue {
    value: {}[];
    done: boolean;
}
export declare abstract class PECInnerPort extends APIPort {
    constructor(messagePort: any);
    abstract onStop(): any;
    abstract onDefineHandle(identifier: string, type: Type, name: string): any;
    abstract onInstantiateParticle(id: string, spec: ParticleSpec, handles: {
        [index: string]: Handle;
    }): any;
    abstract onUIEvent(particle: Particle, slotName: string, event: {}): any;
    abstract onSimpleCallback(callback: (data: {}) => void, data: {}): any;
    abstract onAwaitIdle(version: number): any;
    abstract onStartRender(particle: Particle, slotName: string, providedSlots: Map<string, string>, contentTypes: string[]): any;
    abstract onStopRender(particle: Particle, slotName: string): any;
    Render(particle: Particle, slotName: string, content: string): void;
    InitializeProxy(handle: StorageProxy, callback: (data: {
        version: number;
    }) => void): void;
    SynchronizeProxy(handle: StorageProxy, callback: (data: {
        version: number;
        model: SerializedModelEntry[];
    }) => void): void;
    HandleGet(handle: StorageProxy, callback: (data: {
        id: string;
    }) => void): void;
    HandleToList(handle: StorageProxy, callback: (data: {
        id: string;
    }[]) => void): void;
    HandleSet(handle: StorageProxy, data: {}, particleId: string, barrier: string): void;
    HandleClear(handle: StorageProxy, particleId: string, barrier: string): void;
    HandleStore(handle: StorageProxy, callback: () => void, data: {}, particleId: string): void;
    HandleRemove(handle: StorageProxy, callback: () => void, data: {}, particleId: string): void;
    HandleRemoveMultiple(handle: StorageProxy, callback: () => void, data: {}, particleId: string): void;
    HandleStream(handle: StorageProxy, callback: (data: number) => void, pageSize: number, forward: boolean): void;
    StreamCursorNext(handle: StorageProxy, callback: (value: CursorNextValue) => void, cursorId: string): void;
    StreamCursorClose(handle: StorageProxy, cursorId: string): void;
    Idle(version: number, relevance: Map<Particle, number[]>): void;
    GetBackingStore(callback: (proxy: StorageProxy, key: string) => void, storageKey: string, type: Type): void;
    abstract onGetBackingStoreCallback(callback: (proxy: StorageProxy, key: string) => void, type: Type, name: string, id: string, storageKey: string): any;
    ConstructInnerArc(callback: (arc: string) => void, particle: Particle): void;
    abstract onConstructArcCallback(callback: (arc: string) => void, arc: string): any;
    ArcCreateHandle(callback: (proxy: StorageProxy) => void, arc: {}, type: Type, name: string): void;
    abstract onCreateHandleCallback(callback: (proxy: StorageProxy) => void, type: Type, name: string, id: string): any;
    ArcMapHandle(callback: (value: string) => void, arc: {}, handle: Handle): void;
    abstract onMapHandleCallback(callback: (value: string) => void, id: string): any;
    ArcCreateSlot(callback: (value: string) => void, arc: {}, transformationParticle: Particle, transformationSlotName: string, handleId: string): void;
    abstract onCreateSlotCallback(callback: (value: string) => void, hostedSlotId: string): any;
    abstract onInnerArcRender(transformationParticle: Particle, transformationSlotName: string, hostedSlotID: string, content: string): any;
    ArcLoadRecipe(arc: {}, recipe: string, callback: (data: {
        error?: string;
    }) => void): void;
    RaiseSystemException(exception: {}, methodName: string, particleId: string): void;
    onDevToolsConnected(): void;
}
export {};
