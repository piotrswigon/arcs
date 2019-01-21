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
interface Handle {
    type: Type;
    name: string;
    direction: string;
}
interface Slot {
    name: string;
    direction: string;
    isRequired: boolean;
    isSet: boolean;
}
export declare class InterfaceInfo {
    name: string;
    handles: Handle[];
    slots: Slot[];
    private readonly typeVars;
    constructor(name: string, handles: Handle[], slots: Slot[]);
    toPrettyString(): string;
    mergeTypeVariablesByName(variableMap: any): void;
    readonly canReadSubset: InterfaceInfo;
    readonly canWriteSuperset: InterfaceInfo;
    isMoreSpecificThan(other: any): boolean;
    _applyExistenceTypeTest(test: any): boolean;
    _handlesToManifestString(): string;
    _slotsToManifestString(): string;
    toString(): string;
    static fromLiteral(data: any): InterfaceInfo;
    toLiteral(): {
        name: string;
        handles: {
            type: any;
            name: any;
            direction: any;
        }[];
        slots: {
            name: any;
            direction: any;
            isRequired: any;
            isSet: any;
        }[];
    };
    clone(variableMap: any): InterfaceInfo;
    cloneWithResolutions(variableMap: any): InterfaceInfo;
    _cloneWithResolutions(variableMap: any): InterfaceInfo;
    canEnsureResolved(): boolean;
    maybeEnsureResolved(): boolean;
    tryMergeTypeVariablesWith(other: any): InterfaceInfo;
    resolvedType(): InterfaceInfo;
    equals(other: any): boolean;
    _equalHandle(handle: any, otherHandle: any): any;
    _equalSlot(slot: any, otherSlot: any): boolean;
    _equalItems(otherItems: any, items: any, compareItem: any): boolean;
    _cloneAndUpdate(update: any): InterfaceInfo;
    static _updateTypeVar(typeVar: any, update: any): void;
    static isTypeVar(reference: any): any;
    static mustMatch(reference: any): boolean;
    static handlesMatch(interfaceHandle: any, particleHandle: any): any;
    static slotsMatch(interfaceSlot: any, particleSlot: any): boolean;
    particleMatches(particleSpec: any): boolean;
    restrictType(particleSpec: any): false | this;
    _restrictThis(particleSpec: any): false | this;
}
export {};
