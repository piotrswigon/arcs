/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Recipe } from './recipe/recipe.js';
import { ParticleSpec } from './particle-spec.js';
import { Schema } from './schema.js';
import { InterfaceInfo } from './interface-info.js';
import { Type, EntityType, InterfaceType } from './type.js';
import { StorageProviderBase } from './storage/storage-provider-base.js';
import { StorageProviderFactory } from './storage/storage-provider-factory.js';
import { ManifestMeta } from './manifest-meta.js';
import { Id } from './id.js';
export declare class StorageStub {
    type: Type;
    id: string;
    originalId: string;
    name: string;
    storageKey: string;
    storageProviderFactory: StorageProviderFactory;
    constructor(type: any, id: any, name: any, storageKey: any, storageProviderFactory: any, originalId: any);
    inflate(): Promise<StorageProviderBase>;
}
declare type ManifestFinder<a> = (manifest: Manifest) => a;
declare type ManifestFinderGenerator<a> = ((manifest: Manifest) => IterableIterator<a>) | ((manifest: Manifest) => a[]);
export declare class Manifest {
    private _recipes;
    private _imports;
    private _particles;
    private _schemas;
    private _stores;
    private _interfaces;
    storeTags: Map<StorageProviderBase, string[]>;
    private _fileName;
    private readonly _id;
    private _storageProviderFactory;
    private _meta;
    private _resources;
    private storeManifestUrls;
    private warnings;
    constructor({ id }: {
        id: any;
    });
    readonly id: Id;
    readonly storageProviderFactory: StorageProviderFactory;
    readonly recipes: Recipe[];
    readonly allRecipes: Recipe[];
    readonly activeRecipe: Recipe;
    readonly particles: ParticleSpec[];
    readonly allParticles: ParticleSpec[];
    readonly imports: Manifest[];
    readonly schemas: {
        [index: string]: Schema;
    };
    readonly fileName: string;
    readonly stores: StorageProviderBase[];
    readonly allStores: StorageProviderBase[];
    readonly interfaces: InterfaceInfo[];
    readonly meta: ManifestMeta;
    readonly resources: {};
    applyMeta(section: any): void;
    createStore(type: any, name: any, id: any, tags: any, storageKey?: any): Promise<any>;
    _addStore(store: any, tags: any): any;
    newStorageStub(type: any, name: any, id: any, storageKey: any, tags: any, originalId: any): any;
    _find<a>(manifestFinder: ManifestFinder<a>): a;
    _findAll<a>(manifestFinder: ManifestFinderGenerator<a>): IterableIterator<a>;
    findSchemaByName(name: string): Schema;
    findTypeByName(name: any): EntityType | InterfaceType;
    findParticleByName(name: any): ParticleSpec;
    findParticlesByVerb(verb: any): ParticleSpec[];
    findStoreByName(name: any): StorageProviderBase;
    findStoreById(id: any): StorageProviderBase;
    findStoreTags(store: any): string[];
    findManifestUrlForHandleId(id: any): string;
    findStoreByType(type: any, options?: {
        tags: string[];
        subtype: boolean;
    }): StorageProviderBase[];
    findInterfaceByName(name: any): InterfaceInfo;
    findRecipesByVerb(verb: any): Recipe[];
    generateID(): string;
    static load(fileName: string, loader: any, options?: any): Promise<Manifest>;
    static parse(content: any, options?: any): Promise<Manifest>;
    static _augmentAstWithTypes(manifest: any, items: any): void;
    static _processSchema(manifest: any, schemaItem: any): void;
    static _processResource(manifest: any, schemaItem: any): void;
    static _processParticle(manifest: any, particleItem: any, loader: any): void;
    static _processInterface(manifest: any, interfaceItem: any): void;
    static _processRecipe(manifest: any, recipeItem: any, loader: any): void;
    static _buildRecipe(manifest: any, recipe: any, recipeItem: any): void;
    resolveTypeName(name: any): {
        schema: Schema;
        iface?: undefined;
    } | {
        iface: InterfaceInfo;
        schema?: undefined;
    };
    static _processStore(manifest: any, item: any, loader: any): Promise<void>;
    static _createStore(manifest: any, type: any, name: any, id: any, tags: any, item: any, originalId: any): Promise<any>;
    _newRecipe(name: any): Recipe;
    toString(options?: any): string;
}
export {};
