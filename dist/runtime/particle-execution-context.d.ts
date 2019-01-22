/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Handle } from './handle.js';
import { StorageProxy } from './storage-proxy.js';
import { Loader } from './loader.js';
export declare class ParticleExecutionContext {
    private apiPort;
    private particles;
    private idBase;
    private loader;
    private pendingLoads;
    private scheduler;
    private keyedProxies;
    constructor(port: any, idBase: string, loader: Loader);
    generateID(): string;
    innerArcHandle(arcId: string, particleId: string): {
        createHandle(type: any, name: any, hostParticle: any): Promise<{}>;
        mapHandle(handle: Handle): Promise<{}>;
        createSlot(transformationParticle: any, transformationSlotName: any, handleId: any): Promise<{}>;
        loadRecipe(recipe: any): Promise<{}>;
    };
    getStorageProxy(storageKey: any, type: any): StorageProxy | Promise<StorageProxy>;
    defaultCapabilitySet(): {
        constructInnerArc: (particle: any) => Promise<{}>;
    };
    _instantiateParticle(id: any, spec: any, proxies: any): Promise<any[]>;
    readonly relevance: Map<any, any>;
    readonly busy: boolean;
    readonly idle: Promise<any>;
}
