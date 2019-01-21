// @
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt
import { VolatileStorage } from './volatile-storage.js';
import { FirebaseStorage } from './firebase-storage.js';
import { PouchDbStorage } from './pouchdb/pouch-db-storage.js';
import { SyntheticStorage } from './synthetic-storage.js';
export class StorageProviderFactory {
    constructor(arcId) {
        this.arcId = arcId;
        this._storageInstances = {
            volatile: { storage: new VolatileStorage(arcId), isPersistent: false },
            firebase: { storage: new FirebaseStorage(arcId), isPersistent: true },
            pouchdb: { storage: new PouchDbStorage(arcId), isPersistent: true },
            synthetic: { storage: new SyntheticStorage(arcId, this), isPersistent: false },
        };
    }
    getInstance(key) {
        const instance = this._storageInstances[key.split(':')[0]];
        if (!instance) {
            throw new Error(`unknown storage protocol: ${key}`);
        }
        return instance;
    }
    _storageForKey(key) {
        if (!key) {
            throw new Error('key is required');
        }
        return this.getInstance(key).storage;
    }
    isPersistent(key) {
        return key && this.getInstance(key).isPersistent;
    }
    async construct(id, type, keyFragment) {
        // TODO(shans): don't use reference mode once adapters are implemented
        return await this._storageForKey(keyFragment).construct(id, type, keyFragment);
    }
    async connect(id, type, key) {
        // TODO(shans): don't use reference mode once adapters are implemented
        return await this._storageForKey(key).connect(id, type, key);
    }
    async connectOrConstruct(id, type, key) {
        const storage = this._storageForKey(key);
        let result = await storage.connect(id, type, key);
        if (result == null) {
            result = await storage.construct(id, type, key);
        }
        return result;
    }
    async baseStorageFor(type, keyString) {
        return await this._storageForKey(keyString).baseStorageFor(type, keyString);
    }
    baseStorageKey(type, keyString) {
        return this._storageForKey(keyString).baseStorageKey(type, keyString);
    }
    parseStringAsKey(s) {
        return this._storageForKey(s).parseStringAsKey(s);
    }
    newKey(id, associatedKeyFragment) {
    }
    // For testing
    shutdown() {
        Object.values(this._storageInstances).map(item => item.storage.shutdown());
    }
}
//# sourceMappingURL=storage-provider-factory.js.map