/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { assert } from '../platform/assert-web.js';
import { ParticleSpec } from './particle-spec.js';
import { Type } from './type.js';
import { OuterPortAttachment } from './debug/outer-port-attachment.js';
import { DevtoolsConnection } from './debug/devtools-connection.js';
var MappingType;
(function (MappingType) {
    MappingType[MappingType["Mapped"] = 0] = "Mapped";
    MappingType[MappingType["LocalMapped"] = 1] = "LocalMapped";
    MappingType[MappingType["RemoteMapped"] = 2] = "RemoteMapped";
    MappingType[MappingType["Direct"] = 3] = "Direct";
    MappingType[MappingType["ObjectMap"] = 4] = "ObjectMap";
    MappingType[MappingType["List"] = 5] = "List";
    MappingType[MappingType["ByLiteral"] = 6] = "ByLiteral";
})(MappingType || (MappingType = {}));
const targets = new Map();
function setPropertyKey(target, propertyKey) {
    if (!targets.has(target)) {
        targets.set(target, new Map());
    }
    if (!targets.get(target).has(propertyKey)) {
        targets.get(target).set(propertyKey, []);
    }
}
function set(target, propertyKey, parameterIndex, info) {
    setPropertyKey(target, propertyKey);
    targets.get(target).get(propertyKey)[parameterIndex] = info;
}
function Direct(target, propertyKey, parameterIndex) {
    set(target.constructor, propertyKey, parameterIndex, { type: MappingType.Direct });
}
function Mapped(target, propertyKey, parameterIndex) {
    set(target.constructor, propertyKey, parameterIndex, { type: MappingType.Mapped });
}
function ByLiteral(constructor) {
    return (target, propertyKey, parameterIndex) => {
        const info = { type: MappingType.ByLiteral, converter: constructor };
        set(target.constructor, propertyKey, parameterIndex, info);
    };
}
function ObjectMap(key, value) {
    return (target, propertyKey, parameterIndex) => {
        const info = { type: MappingType.ObjectMap, key: { type: key }, value: { type: value } };
        set(target.constructor, propertyKey, parameterIndex, info);
    };
}
function List(value) {
    return (target, propertyKey, parameterIndex) => {
        const info = { type: MappingType.List, value: { type: value } };
        set(target.constructor, propertyKey, parameterIndex, info);
    };
}
function LocalMapped(target, propertyKey, parameterIndex) {
    set(target.constructor, propertyKey, parameterIndex, { type: MappingType.LocalMapped });
}
function RemoteMapped(target, propertyKey, parameterIndex) {
    set(target.constructor, propertyKey, parameterIndex, { type: MappingType.RemoteMapped });
}
function NoArgs(target, propertyKey) {
    setPropertyKey(target.constructor, propertyKey);
}
function RedundantInitializer(target, propertyKey, parameterIndex) {
    set(target.constructor, propertyKey, parameterIndex, { type: MappingType.Direct, initializer: true, redundant: true });
}
function Initializer(target, propertyKey, parameterIndex) {
    set(target.constructor, propertyKey, parameterIndex, { type: MappingType.Direct, initializer: true });
}
function Identifier(target, propertyKey, parameterIndex) {
    assert(targets.get(target.constructor));
    assert(targets.get(target.constructor).get(propertyKey));
    assert(targets.get(target.constructor).get(propertyKey)[parameterIndex]);
    targets.get(target.constructor).get(propertyKey)[parameterIndex].identifier = true;
}
function RemoteIgnore(target, propertyKey, parameterIndex) {
    assert(targets.get(target.constructor));
    assert(targets.get(target.constructor).get(propertyKey));
    assert(targets.get(target.constructor).get(propertyKey)[parameterIndex]);
    targets.get(target.constructor).get(propertyKey)[parameterIndex].ignore = true;
}
class ThingMapper {
    constructor(prefix) {
        this._prefix = prefix;
        this._nextIdentifier = 0;
        this._idMap = new Map();
        this._reverseIdMap = new Map();
    }
    _newIdentifier() {
        return this._prefix + (this._nextIdentifier++);
    }
    createMappingForThing(thing, requestedId = undefined) {
        assert(!this._reverseIdMap.has(thing));
        let id;
        if (requestedId) {
            id = requestedId;
        }
        else if (thing.apiChannelMappingId) {
            id = thing.apiChannelMappingId;
        }
        else {
            id = this._newIdentifier();
        }
        assert(!this._idMap.has(id), `${requestedId ? 'requestedId' : (thing.apiChannelMappingId ? 'apiChannelMappingId' : 'newIdentifier()')} ${id} already in use`);
        this.establishThingMapping(id, thing);
        return id;
    }
    maybeCreateMappingForThing(thing) {
        if (this.hasMappingForThing(thing)) {
            return this.identifierForThing(thing);
        }
        return this.createMappingForThing(thing);
    }
    async establishThingMapping(id, thing) {
        let continuation;
        if (Array.isArray(thing)) {
            [thing, continuation] = thing;
        }
        this._idMap.set(id, thing);
        if (thing instanceof Promise) {
            assert(continuation == null);
            await this.establishThingMapping(id, await thing);
        }
        else {
            this._reverseIdMap.set(thing, id);
            if (continuation) {
                await continuation();
            }
        }
    }
    hasMappingForThing(thing) {
        return this._reverseIdMap.has(thing);
    }
    identifierForThing(thing) {
        assert(this._reverseIdMap.has(thing), `Missing thing [${thing}]`);
        return this._reverseIdMap.get(thing);
    }
    thingForIdentifier(id) {
        assert(this._idMap.has(id), `Missing id: ${id}`);
        return this._idMap.get(id);
    }
}
export class APIPort {
    constructor(messagePort, prefix) {
        this._port = messagePort;
        this._mapper = new ThingMapper(prefix);
        this._port.onmessage = async (e) => this._processMessage(e);
        this._debugAttachment = null;
        this._attachStack = false;
        this.messageCount = 0;
        this._testingHook();
    }
    // Overridden by unit tests.
    _testingHook() {
    }
    close() {
        this._port.close();
    }
    async _processMessage(e) {
        assert(this['before' + e.data.messageType] !== undefined);
        const count = this.messageCount++;
        if (this._debugAttachment) {
            this._debugAttachment.handlePecMessage('on' + e.data.messageType, e.data.messageBody, count, e.data.stack);
        }
        this['before' + e.data.messageType](e.data.messageBody);
    }
    send(name, args) {
        const call = { messageType: name, messageBody: args, stack: this._attachStack ? new Error().stack : undefined };
        const count = this.messageCount++;
        if (this._debugAttachment) {
            this._debugAttachment.handlePecMessage(name, args, count, new Error().stack);
        }
        this._port.postMessage(call);
    }
}
// The horror. From https://davidwalsh.name/javascript-arguments
function getArgs(func) {
    // First match everything inside the function argument parens.
    const args = func.toString().match(/.*?\(([^)]*)\)/)[1];
    // Split the arguments string into an array comma delimited.
    return args.split(',').map((arg) => {
        // Ensure no inline comments are parsed and trim the whitespace.
        return arg.replace(/\/\*.*\*\//, '').trim();
        // Ensure no undefined values are added.
    }).filter((arg) => arg);
}
// value is covariant with info, and errors will be found
// at start of runtime. 
// tslint:disable-next-line: no-any
function convert(info, value, mapper) {
    switch (info.type) {
        case MappingType.Mapped:
            return mapper.identifierForThing(value);
        case MappingType.LocalMapped:
            return mapper.maybeCreateMappingForThing(value);
        case MappingType.RemoteMapped:
            // This is on the local side, so we don't do anything here.
            return value;
        case MappingType.Direct:
            return value;
        case MappingType.ObjectMap:
            const r = {};
            value.forEach((childvalue, key) => r[convert(info.key, key, mapper)] = convert(info.value, childvalue, mapper));
            return r;
        case MappingType.List:
            return value.map(v => convert(info.value, v, mapper));
        case MappingType.ByLiteral:
            return value.toLiteral();
        default:
            throw new Error(`Can't yet send MappingType ${info.type}`);
    }
}
// value is covariant with info, and errors will be found
// at start of runtime. 
// tslint:disable-next-line: no-any
function unconvert(info, value, mapper) {
    switch (info.type) {
        case MappingType.Mapped:
            return mapper.thingForIdentifier(value);
        case MappingType.LocalMapped:
            // This is on the remote side, so we don't do anything here.
            return value;
        case MappingType.RemoteMapped:
            return mapper.thingForIdentifier(value);
        case MappingType.Direct:
            return value;
        case MappingType.ObjectMap:
            const r = new Map();
            for (const key of Object.keys(value)) {
                r.set(unconvert(info.key, key, mapper), unconvert(info.value, value[key], mapper));
            }
            return r;
        case MappingType.List:
            return value.map(v => unconvert(info.value, v, mapper));
        case MappingType.ByLiteral:
            return info.converter.fromLiteral(value);
        default:
            throw new Error(`Can't yet recieve MappingType ${info.type}`);
    }
}
function AutoConstruct(target) {
    return (constructor) => {
        const doConstruct = (me, other) => {
            const functions = targets.get(me);
            for (const f of functions.keys()) {
                const argNames = getArgs(me.prototype[f]);
                const descriptor = functions.get(f);
                // If this descriptor is for an initializer, record that fact and we'll process it after
                // the rest of the arguments.
                const initializer = descriptor.findIndex(d => d.initializer);
                // If this descriptor records that this argument is the identifier, record it
                // as the requestedId for mapping below.
                const requestedId = descriptor.findIndex(d => d.identifier);
                function impl(...args) {
                    const messageBody = {};
                    for (let i = 0; i < descriptor.length; i++) {
                        if (i === initializer) {
                            continue;
                        }
                        // Process this argument.
                        messageBody[argNames[i]] = convert(descriptor[i], args[i], this._mapper);
                    }
                    // Process the initializer if present.
                    if (initializer !== -1) {
                        if (descriptor[initializer].redundant) {
                            assert(requestedId === -1);
                            messageBody['identifier'] = this._mapper.maybeCreateMappingForThing(args[initializer]);
                        }
                        else {
                            messageBody['identifier'] = this._mapper.createMappingForThing(args[initializer], args[requestedId]);
                        }
                    }
                    this.send(f, messageBody);
                }
                async function before(messageBody) {
                    const args = [];
                    const promises = [];
                    for (let i = 0; i < descriptor.length; i++) {
                        // If there's a requestedId then the receiving end won't expect to
                        // see the identifier as well.
                        if (i === initializer && (requestedId !== -1 || descriptor[i].ignore)) {
                            continue;
                        }
                        const argName = i === initializer ? 'identifier' : argNames[i];
                        const result = unconvert(descriptor[i], messageBody[argName], this._mapper);
                        if (result instanceof Promise) {
                            promises.push({ promise: result, position: args.length });
                            args.push(() => unconvert(descriptor[i], messageBody[argName], this._mapper));
                        }
                        else {
                            args.push(result);
                        }
                    }
                    if (promises.length > 0) {
                        await Promise.all(promises.map(a => a.promise));
                        promises.forEach(a => args[a.position] = args[a.position]());
                    }
                    const result = this['on' + f](...args);
                    // If this message is an initializer, need to establish a mapping
                    // with the result of processing the message.
                    if (initializer > -1) {
                        assert(messageBody['identifier']);
                        await this._mapper.establishThingMapping(messageBody['identifier'], result);
                    }
                }
                Object.defineProperty(me.prototype, f, {
                    get() {
                        return impl;
                    }
                });
                Object.defineProperty(other.prototype, 'before' + f, {
                    get() {
                        return before;
                    }
                });
            }
        };
        doConstruct(constructor, target);
        doConstruct(target, constructor);
    };
}
export class PECOuterPort extends APIPort {
    constructor(messagePort, arc) {
        super(messagePort, 'o');
        DevtoolsConnection.onceConnected.then(devtoolsChannel => {
            this.DevToolsConnected();
            this._debugAttachment = new OuterPortAttachment(arc, devtoolsChannel);
        });
    }
    Stop() { }
    DefineHandle(handle, type, name) { }
    InstantiateParticle(particle, id, spec, handles) { }
    UIEvent(particle, slotName, event) { }
    SimpleCallback(callback, data) { }
    AwaitIdle(version) { }
    StartRender(particle, slotName, providedSlots, contentTypes) { }
    StopRender(particle, slotName) { }
    GetBackingStoreCallback(store, callback, type, name, id, storageKey) { }
    ConstructArcCallback(callback, arc) { }
    CreateHandleCallback(handle, callback, type, name, id) { }
    MapHandleCallback(newHandle, callback, id) { }
    CreateSlotCallback(slot, callback, hostedSlotId) { }
    InnerArcRender(transformationParticle, transformationSlotName, hostedSlotId, content) { }
    // We need an API call to tell the context side that DevTools has been connected, so it can start sending
    // stack traces attached to the API calls made from that side.
    DevToolsConnected() { }
}
__decorate([
    NoArgs
], PECOuterPort.prototype, "Stop", null);
__decorate([
    __param(0, RedundantInitializer), __param(1, ByLiteral(Type)), __param(2, Direct)
], PECOuterPort.prototype, "DefineHandle", null);
__decorate([
    __param(0, Initializer), __param(1, Identifier), __param(1, Direct), __param(2, ByLiteral(ParticleSpec)), __param(3, ObjectMap(MappingType.Direct, MappingType.Mapped))
], PECOuterPort.prototype, "InstantiateParticle", null);
__decorate([
    __param(0, Mapped), __param(1, Direct), __param(2, Direct)
], PECOuterPort.prototype, "UIEvent", null);
__decorate([
    __param(0, RemoteMapped), __param(1, Direct)
], PECOuterPort.prototype, "SimpleCallback", null);
__decorate([
    __param(0, Direct)
], PECOuterPort.prototype, "AwaitIdle", null);
__decorate([
    __param(0, Mapped), __param(1, Direct), __param(2, ObjectMap(MappingType.Direct, MappingType.Direct)), __param(3, List(MappingType.Direct))
], PECOuterPort.prototype, "StartRender", null);
__decorate([
    __param(0, Mapped), __param(1, Direct)
], PECOuterPort.prototype, "StopRender", null);
__decorate([
    __param(0, Initializer), __param(1, RemoteMapped), __param(2, ByLiteral(Type)), __param(3, Direct), __param(4, Identifier), __param(4, Direct), __param(5, Direct)
], PECOuterPort.prototype, "GetBackingStoreCallback", null);
__decorate([
    __param(0, RemoteMapped), __param(1, LocalMapped)
], PECOuterPort.prototype, "ConstructArcCallback", null);
__decorate([
    __param(0, Initializer), __param(1, RemoteMapped), __param(2, ByLiteral(Type)), __param(3, Direct), __param(4, Identifier), __param(4, Direct)
], PECOuterPort.prototype, "CreateHandleCallback", null);
__decorate([
    __param(0, RemoteIgnore), __param(0, Initializer), __param(1, RemoteMapped), __param(2, Direct)
], PECOuterPort.prototype, "MapHandleCallback", null);
__decorate([
    __param(0, RemoteIgnore), __param(0, Initializer), __param(1, RemoteMapped), __param(2, Direct)
], PECOuterPort.prototype, "CreateSlotCallback", null);
__decorate([
    __param(0, Mapped), __param(1, Direct), __param(2, Direct), __param(3, Direct)
], PECOuterPort.prototype, "InnerArcRender", null);
__decorate([
    NoArgs
], PECOuterPort.prototype, "DevToolsConnected", null);
let PECInnerPort = class PECInnerPort extends APIPort {
    constructor(messagePort) {
        super(messagePort, 'i');
    }
    Render(particle, slotName, content) { }
    InitializeProxy(handle, callback) { }
    SynchronizeProxy(handle, callback) { }
    HandleGet(handle, callback) { }
    HandleToList(handle, callback) { }
    HandleSet(handle, data, particleId, barrier) { }
    HandleClear(handle, particleId, barrier) { }
    HandleStore(handle, callback, data, particleId) { }
    HandleRemove(handle, callback, data, particleId) { }
    HandleRemoveMultiple(handle, callback, data, particleId) { }
    HandleStream(handle, callback, pageSize, forward) { }
    StreamCursorNext(handle, callback, cursorId) { }
    StreamCursorClose(handle, cursorId) { }
    Idle(version, relevance) { }
    GetBackingStore(callback, storageKey, type) { }
    ConstructInnerArc(callback, particle) { }
    ArcCreateHandle(callback, arc, type, name) { }
    ArcMapHandle(callback, arc, handle) { }
    ArcCreateSlot(callback, arc, transformationParticle, transformationSlotName, handleId) { }
    ArcLoadRecipe(arc, recipe, callback) { }
    RaiseSystemException(exception, methodName, particleId) { }
    // To show stack traces for calls made inside the context, we need to capture the trace at the call point and
    // send it along with the message. We only want to do this after a DevTools connection has been detected, which
    // we can't directly detect inside a worker context, so the PECOuterPort will send an API message instead.
    onDevToolsConnected() {
        this._attachStack = true;
    }
};
__decorate([
    __param(0, Mapped), __param(1, Direct), __param(2, Direct)
], PECInnerPort.prototype, "Render", null);
__decorate([
    __param(0, Mapped), __param(1, LocalMapped)
], PECInnerPort.prototype, "InitializeProxy", null);
__decorate([
    __param(0, Mapped), __param(1, LocalMapped)
], PECInnerPort.prototype, "SynchronizeProxy", null);
__decorate([
    __param(0, Mapped), __param(1, LocalMapped)
], PECInnerPort.prototype, "HandleGet", null);
__decorate([
    __param(0, Mapped), __param(1, LocalMapped)
], PECInnerPort.prototype, "HandleToList", null);
__decorate([
    __param(0, Mapped), __param(1, Direct), __param(2, Direct), __param(3, Direct)
], PECInnerPort.prototype, "HandleSet", null);
__decorate([
    __param(0, Mapped), __param(1, Direct), __param(2, Direct)
], PECInnerPort.prototype, "HandleClear", null);
__decorate([
    __param(0, Mapped), __param(1, LocalMapped), __param(2, Direct), __param(3, Direct)
], PECInnerPort.prototype, "HandleStore", null);
__decorate([
    __param(0, Mapped), __param(1, LocalMapped), __param(2, Direct), __param(3, Direct)
], PECInnerPort.prototype, "HandleRemove", null);
__decorate([
    __param(0, Mapped), __param(1, LocalMapped), __param(2, Direct), __param(3, Direct)
], PECInnerPort.prototype, "HandleRemoveMultiple", null);
__decorate([
    __param(0, Mapped), __param(1, LocalMapped), __param(2, Direct), __param(3, Direct)
], PECInnerPort.prototype, "HandleStream", null);
__decorate([
    __param(0, Mapped), __param(1, LocalMapped), __param(2, Direct)
], PECInnerPort.prototype, "StreamCursorNext", null);
__decorate([
    __param(0, Mapped), __param(1, Direct)
], PECInnerPort.prototype, "StreamCursorClose", null);
__decorate([
    __param(0, Direct), __param(1, ObjectMap(MappingType.Mapped, MappingType.Direct))
], PECInnerPort.prototype, "Idle", null);
__decorate([
    __param(0, LocalMapped), __param(1, Direct), __param(2, ByLiteral(Type))
], PECInnerPort.prototype, "GetBackingStore", null);
__decorate([
    __param(0, LocalMapped), __param(1, Mapped)
], PECInnerPort.prototype, "ConstructInnerArc", null);
__decorate([
    __param(0, LocalMapped), __param(1, RemoteMapped), __param(2, ByLiteral(Type)), __param(3, Direct)
], PECInnerPort.prototype, "ArcCreateHandle", null);
__decorate([
    __param(0, LocalMapped), __param(1, RemoteMapped), __param(2, Mapped)
], PECInnerPort.prototype, "ArcMapHandle", null);
__decorate([
    __param(0, LocalMapped), __param(1, RemoteMapped), __param(2, Mapped), __param(3, Direct), __param(4, Direct)
], PECInnerPort.prototype, "ArcCreateSlot", null);
__decorate([
    __param(0, RemoteMapped), __param(1, Direct), __param(2, LocalMapped)
], PECInnerPort.prototype, "ArcLoadRecipe", null);
__decorate([
    __param(0, Direct), __param(1, Direct), __param(2, Direct)
], PECInnerPort.prototype, "RaiseSystemException", null);
PECInnerPort = __decorate([
    AutoConstruct(PECOuterPort)
], PECInnerPort);
export { PECInnerPort };
//# sourceMappingURL=api-channel.js.map