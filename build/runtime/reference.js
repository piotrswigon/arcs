/** @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { assert } from '../platform/assert-web.js';
import { ReferenceType } from './type.js';
import { handleFor } from './handle.js';
var ReferenceMode;
(function (ReferenceMode) {
    ReferenceMode[ReferenceMode["Unstored"] = 0] = "Unstored";
    ReferenceMode[ReferenceMode["Stored"] = 1] = "Stored";
})(ReferenceMode || (ReferenceMode = {}));
export class Reference {
    constructor(data, type, context) {
        this.entity = null;
        this.storageProxy = null;
        this.handle = null;
        this.id = data.id;
        this.storageKey = data.storageKey;
        this.context = context;
        this.type = type;
    }
    async ensureStorageProxy() {
        if (this.storageProxy == null) {
            this.storageProxy = await this.context.getStorageProxy(this.storageKey, this.type.referredType);
            this.handle = handleFor(this.storageProxy);
            if (this.storageKey) {
                assert(this.storageKey === this.storageProxy.storageKey);
            }
            else {
                this.storageKey = this.storageProxy.storageKey;
            }
        }
    }
    async dereference() {
        assert(this.context, "Must have context to dereference");
        if (this.entity) {
            return this.entity;
        }
        await this.ensureStorageProxy();
        this.entity = await this.handle.get(this.id);
        return this.entity;
    }
    dataClone() {
        return { storageKey: this.storageKey, id: this.id };
    }
    static newClientReference(context) {
        return class extends Reference {
            constructor(entity) {
                // TODO(shans): start carrying storageKey information around on Entity objects
                super({ id: entity.id, storageKey: null }, new ReferenceType(entity.constructor.type), context);
                this.mode = ReferenceMode.Unstored;
                this.entity = entity;
                this.stored = new Promise(async (resolve, reject) => {
                    await this.storeReference(entity);
                    resolve();
                });
            }
            async storeReference(entity) {
                await this.ensureStorageProxy();
                await this.handle.store(entity);
                this.mode = ReferenceMode.Stored;
            }
            async dereference() {
                if (this.mode === ReferenceMode.Unstored) {
                    return null;
                }
                return super.dereference();
            }
            isIdentified() {
                return this.entity.isIdentified();
            }
        };
    }
}
//# sourceMappingURL=reference.js.map