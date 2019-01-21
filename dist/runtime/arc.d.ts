/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Type } from './type.js';
import { ParticleExecutionHost } from './particle-execution-host.js';
import { Recipe } from './recipe/recipe.js';
import { Manifest } from './manifest.js';
import { Description } from './description.js';
import { StorageProviderFactory } from './storage/storage-provider-factory.js';
import { Id } from './id.js';
import { Loader } from './loader.js';
import { StorageProviderBase } from './storage/storage-provider-base.js';
import { ParticleSpec } from './particle-spec.js';
import { PECInnerPort } from './api-channel.js';
import { Particle } from './recipe/particle.js';
import { SlotComposer } from './slot-composer.js';
import { Modality } from './modality.js';
declare type ArcOptions = {
    id: string;
    context: Manifest;
    pecFactory?: (id: string) => PECInnerPort;
    slotComposer?: SlotComposer;
    loader: Loader;
    storageKey?: string;
    storageProviderFactory?: StorageProviderFactory;
    speculative?: boolean;
};
export declare type PlanCallback = (recipe: Recipe) => void;
declare type SerializeContext = {
    handles: string;
    resources: string;
    interfaces: string;
    dataResources: Map<string, string>;
};
export declare class Arc {
    private readonly _context;
    private readonly pecFactory;
    private readonly speculative;
    private _activeRecipe;
    private _recipes;
    readonly _loader: Loader;
    private dataChangeCallbacks;
    private storesById;
    private storageKeys;
    readonly storageKey: string;
    readonly arcId: string;
    storageProviderFactory: StorageProviderFactory;
    storeTags: Map<StorageProviderBase, Set<string>>;
    private storeDescriptions;
    private readonly _description;
    private instantiatePlanCallbacks;
    private waitForIdlePromise;
    private debugHandler;
    readonly id: Id;
    particleHandleMaps: Map<string, {
        spec: ParticleSpec;
        handles: Map<string, StorageProviderBase>;
    }>;
    pec: ParticleExecutionHost;
    constructor({ id, context, pecFactory, slotComposer, loader, storageKey, storageProviderFactory, speculative }: ArcOptions);
    readonly loader: Loader;
    readonly description: Description;
    readonly modality: Modality;
    registerInstantiatePlanCallback(callback: PlanCallback): void;
    unregisterInstantiatePlanCallback(callback: PlanCallback): boolean;
    dispose(): void;
    _waitForIdle(): Promise<void>;
    readonly idle: Promise<void>;
    readonly isSpeculative: boolean;
    _serializeHandle(handle: StorageProviderBase, context: SerializeContext, id: string): Promise<void>;
    _serializeHandles(): Promise<string>;
    _serializeParticles(): string;
    _serializeStorageKey(): string;
    serialize(): Promise<string>;
    persistSerialization(serialization: string): Promise<void>;
    static deserialize({ serialization, pecFactory, slotComposer, loader, fileName, context }: {
        serialization: any;
        pecFactory: any;
        slotComposer: any;
        loader: any;
        fileName: any;
        context: any;
    }): Promise<Arc>;
    readonly context: Manifest;
    readonly activeRecipe: Recipe;
    readonly recipes: any[];
    loadedParticles(): ParticleSpec[];
    _instantiateParticle(recipeParticle: Particle): void;
    generateID(component?: string): string;
    readonly _stores: StorageProviderBase[];
    cloneForSpeculativeExecution(): Promise<Arc>;
    instantiate(recipe: Recipe, innerArc?: any): Promise<void>;
    _connectParticleToHandle(particle: any, name: any, targetHandle: any): void;
    createStore(type: Type, name: any, id: any, tags?: any, storageKey?: any): Promise<StorageProviderBase>;
    _registerStore(store: StorageProviderBase, tags?: any): void;
    _tagStore(store: StorageProviderBase, tags: any): void;
    _onDataChange(): void;
    onDataChange(callback: any, registration: any): void;
    clearDataChange(registration: any): void;
    static _typeToKey(type: Type): any;
    findStoresByType(type: Type, options?: any): StorageProviderBase[];
    findStoreById(id: any): StorageProviderBase;
    findStoreTags(store: StorageProviderBase): Set<string> | string[];
    getStoreDescription(store: any): any;
    getVersionByStore({ includeArc, includeContext }: {
        includeArc?: boolean;
        includeContext?: boolean;
    }): {};
    keyForId(id: string): string;
    stop(): void;
    toContextString(options: any): string;
}
export {};
