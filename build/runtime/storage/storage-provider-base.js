// @
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt
import { assert } from '../../platform/assert-web.js';
import { Tracing } from '../../tracelib/trace.js';
import { compareStrings, compareNumbers } from '../recipe/util.js';
var EventKind;
(function (EventKind) {
    EventKind["change"] = "Change";
})(EventKind || (EventKind = {}));
export class StorageBase {
    constructor(arcId) {
        this.arcId = arcId;
        this._debug = false;
        assert(arcId !== undefined, 'Arcs with storage must have ids');
    }
    /**
     * Turn on debugginf for this storage provider.  Providers should
     * subclass this and react to changes in the debug value.
     */
    set debug(d) {
        this._debug = d;
    }
    /**
     * Provides graceful shutdown for tests.
     */
    shutdown() { }
}
export class ChangeEvent {
    constructor(args) {
        Object.assign(this, args);
    }
}
/**
 * Docs TBD
 */
export class StorageProviderBase {
    constructor(type, name, id, key) {
        this.referenceMode = false;
        assert(id, 'id must be provided when constructing StorageProviders');
        assert(!type.hasUnresolvedVariable, 'Storage types must be concrete');
        const trace = Tracing.start({ cat: 'handle', name: 'StorageProviderBase::constructor', args: { type: type.toString(), name } });
        this._type = type;
        this.listeners = new Map();
        this.name = name;
        this.version = 0;
        this.id = id;
        this.source = null;
        this._storageKey = key;
        this.nextLocalID = 0;
        trace.end();
    }
    enableReferenceMode() {
        this.referenceMode = true;
    }
    get storageKey() {
        return this._storageKey;
    }
    generateID() {
        return `${this.id}:${this.nextLocalID++}`;
    }
    generateIDComponents() {
        return { base: this.id, component: () => this.nextLocalID++ };
    }
    get type() {
        return this._type;
    }
    // TODO: add 'once' which returns a promise.
    on(kindStr, callback, target) {
        assert(target !== undefined, 'must provide a target to register a storage event handler');
        const kind = EventKind[kindStr];
        const listeners = this.listeners.get(kind) || new Map();
        listeners.set(callback, { target });
        this.listeners.set(kind, listeners);
    }
    off(kindStr, callback) {
        const kind = EventKind[kindStr];
        const listeners = this.listeners.get(kind);
        if (listeners) {
            listeners.delete(callback);
        }
    }
    // TODO: rename to _fireAsync so it's clear that callers are not re-entrant.
    /**
     * Propagate updates to change listeners.
     *
     * @param kindStr the type of event, only 'change' is supported.
     * @param details details about the change
     */
    async _fire(kindStr, details) {
        const kind = EventKind[kindStr];
        const listenerMap = this.listeners.get(kind);
        if (!listenerMap || listenerMap.size === 0) {
            return;
        }
        const trace = Tracing.start({ cat: 'handle', name: 'StorageProviderBase::_fire', args: { kind, type: this.type.tag,
                name: this.name, listeners: listenerMap.size } });
        const callbacks = [];
        for (const [callback] of listenerMap.entries()) {
            callbacks.push(callback);
        }
        // Yield so that event firing is not re-entrant with mutation.
        await trace.wait(0);
        for (const callback of callbacks) {
            callback(details);
        }
        trace.end();
    }
    _compareTo(other) {
        let cmp;
        cmp = compareStrings(this.name, other.name);
        if (cmp !== 0)
            return cmp;
        cmp = compareNumbers(this.version, other.version);
        if (cmp !== 0)
            return cmp;
        cmp = compareStrings(this.source, other.source);
        if (cmp !== 0)
            return cmp;
        cmp = compareStrings(this.id, other.id);
        if (cmp !== 0)
            return cmp;
        return 0;
    }
    toString(handleTags) {
        const results = [];
        const handleStr = [];
        handleStr.push(`store`);
        if (this.name) {
            handleStr.push(`${this.name}`);
        }
        handleStr.push(`of ${this.type.toString()}`);
        if (this.id) {
            handleStr.push(`'${this.id}'`);
        }
        if (handleTags && handleTags.length) {
            handleStr.push(`${handleTags.join(' ')}`);
        }
        if (this.source) {
            handleStr.push(`in '${this.source}'`);
        }
        results.push(handleStr.join(' '));
        if (this.description) {
            results.push(`  description \`${this.description}\``);
        }
        return results.join('\n');
    }
    get apiChannelMappingId() {
        return this.id;
    }
    // TODO: make abstract?
    dispose() { }
    /** TODO */
    modelForSynchronization() {
        return this.toLiteral();
    }
}
//# sourceMappingURL=storage-provider-base.js.map