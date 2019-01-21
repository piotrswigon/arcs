// @license
// Copyright (c) 2018 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt
import { assert } from '../../platform/assert-web.js';
import { StorageBase, StorageProviderBase, ChangeEvent } from './storage-provider-base.js';
import { KeyBase } from './key-base.js';
import { ArcType, HandleType } from '../type.js';
import { ArcInfo, ArcHandle } from '../synthetic-types.js';
import { Manifest } from '../manifest.js';
import { setDiffCustom } from '../util.js';
var Scope;
(function (Scope) {
    Scope[Scope["arc"] = 1] = "arc"; // target must be a storage key for an ArcInfo Variable
})(Scope || (Scope = {}));
var Category;
(function (Category) {
    Category[Category["handles"] = 1] = "handles"; // synthetic data will be a collection of ArcHandles
})(Category || (Category = {}));
// Format is 'synthetic://<scope>/<category>/<target>'
class SyntheticKey extends KeyBase {
    constructor(key, storageFactory) {
        super();
        const match = key.match(/^synthetic:\/\/([^/]+)\/([^/]+)\/(.+)$/);
        if (match === null || match.length !== 4) {
            throw new Error(`invalid synthetic key: ${key}`);
        }
        this.scope = Scope[match[1]];
        this.category = Category[match[2]];
        if (this.scope === Scope.arc) {
            this.targetType = new ArcType();
            const key = storageFactory.parseStringAsKey(match[3]).childKeyForArcInfo();
            this.targetKey = key.toString();
        }
        else {
            throw new Error(`invalid scope '${match[1]}' for synthetic key: ${key}`);
        }
        if (this.category === Category.handles) {
            this.syntheticType = new HandleType();
        }
        else {
            throw new Error(`invalid category '${match[2]}' for synthetic key: ${key}`);
        }
    }
    get protocol() {
        return 'synthetic';
    }
    base() {
        assert(false, 'base not supported for synthetic keys');
        return null;
    }
    get arcId() {
        assert(false, 'arcId not supported for synthetic keys');
        return null;
    }
    childKeyForHandle(id) {
        assert(false, 'childKeyForHandle not supported for synthetic keys');
        return null;
    }
    childKeyForArcInfo() {
        assert(false, 'childKeyForArcInfo not supported for synthetic keys');
        return null;
    }
    childKeyForSuggestions(userId, arcId) {
        assert(false, 'childKeyForSuggestions not supported for synthetic keys');
        return null;
    }
    childKeyForSearch(userId) {
        assert(false, 'childKeyForSearch not supported for synthetic keys');
        return null;
    }
    toString() {
        return `${this.protocol}://${Scope[this.scope]}/${Category[this.category]}/${this.targetKey}`;
    }
}
export class SyntheticStorage extends StorageBase {
    constructor(arcId, storageFactory) {
        super(arcId);
        this.storageFactory = storageFactory;
    }
    async construct(id, type, keyFragment) {
        throw new Error('cannot construct SyntheticStorage providers; use connect');
    }
    async connect(id, type, key) {
        assert(type === null, 'SyntheticStorage does not accept a type parameter');
        const synthKey = new SyntheticKey(key, this.storageFactory);
        const targetStore = await this.storageFactory.connect(id, synthKey.targetType, synthKey.targetKey);
        if (targetStore === null) {
            return null;
        }
        return new SyntheticCollection(synthKey.syntheticType, id, key, targetStore, this.storageFactory);
    }
    async baseStorageFor(type, key) {
        throw new Error('baseStorageFor not implemented for SyntheticStorage');
    }
    baseStorageKey(type, key) {
        throw new Error('baseStorageKey not implemented for SyntheticStorage');
    }
    parseStringAsKey(s) {
        return new SyntheticKey(s, this.storageFactory);
    }
}
// Currently hard-wired to parse serialized data in an ArcInfo Variable to provide a list of ArcHandles.
class SyntheticCollection extends StorageProviderBase {
    constructor(type, id, key, targetStore, storageFactory) {
        super(type, undefined, id, key);
        this.model = [];
        this.backingStore = undefined;
        this.targetStore = targetStore;
        this.storageFactory = storageFactory;
        let resolveInitialized;
        this.initialized = new Promise(resolve => resolveInitialized = resolve);
        const process = async (data) => {
            await this.process(data, false);
            resolveInitialized();
            targetStore.on('change', details => this.process(details.data, true), this);
        };
        targetStore.get().then(data => process(data));
    }
    async process(data, fireEvent) {
        let handles;
        try {
            if (data) {
                const manifest = await Manifest.parse(ArcInfo.extractSerialization(data), {});
                handles = manifest.activeRecipe && manifest.activeRecipe.handles;
            }
        }
        catch (e) {
            console.warn(`Error parsing manifest at ${this.storageKey}:\n${e.message}`);
        }
        const oldModel = this.model;
        this.model = [];
        for (const handle of handles || []) {
            if (this.storageFactory.isPersistent(handle._storageKey)) {
                this.model.push(new ArcHandle(handle.storageKey, handle.mappedType, handle.tags));
            }
        }
        if (fireEvent) {
            const diff = setDiffCustom(oldModel, this.model, JSON.stringify);
            const add = diff.add.map(arcHandle => ({ value: arcHandle }));
            const remove = diff.remove.map(arcHandle => ({ value: arcHandle }));
            this._fire('change', new ChangeEvent({ add, remove }));
        }
    }
    async toList() {
        await this.initialized;
        return this.model;
    }
    async toLiteral() {
        return this.toList();
    }
    cloneFrom() {
        throw new Error('cloneFrom should never be called on SyntheticCollection!');
    }
    ensureBackingStore() {
        throw new Error('ensureBackingStore should never be called on SyntheticCollection!');
    }
    // tslint:disable-next-line: no-any
    async getMultiple(ids) {
        throw new Error('unimplemented');
    }
    async storeMultiple(values, keys, originatorId) {
        throw new Error('unimplemented');
    }
    removeMultiple(items, originatorId) {
        throw new Error('unimplemented');
    }
    async get(id) {
        throw new Error('unimplemented');
    }
    remove(id, keys, originatorId) {
        throw new Error('unimplemented');
    }
    store(value, keys, originatorId) {
        throw new Error('unimplemented');
    }
}
//# sourceMappingURL=synthetic-storage.js.map