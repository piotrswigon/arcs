/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Direction } from './recipe/handle-connection.js';
import { Modality } from './modality.js';
import { Type, TypeLiteral, InterfaceType } from './type.js';
declare type SerializedConnectionSpec = {
    direction: Direction;
    name: string;
    type: Type | TypeLiteral;
    isOptional: boolean;
    tags?: string[];
    dependentConnections: SerializedConnectionSpec[];
};
export declare class ConnectionSpec {
    rawData: SerializedConnectionSpec;
    direction: Direction;
    name: string;
    type: Type;
    isOptional: boolean;
    tags: string[];
    dependentConnections: ConnectionSpec[];
    pattern: string;
    parentConnection: ConnectionSpec | null;
    constructor(rawData: SerializedConnectionSpec, typeVarMap: Map<string, Type>);
    instantiateDependentConnections(particle: any, typeVarMap: Map<string, Type>): void;
    readonly isInput: boolean;
    readonly isOutput: boolean;
    isCompatibleType(type: any): any;
}
declare type SerializedSlotSpec = {
    name: string;
    isRequired: boolean;
    isSet: boolean;
    tags: string[];
    formFactor: string;
    providedSlots: SerializedProvidedSlotSpec[];
};
export declare class SlotSpec {
    name: string;
    isRequired: boolean;
    isSet: boolean;
    tags: string[];
    formFactor: string;
    providedSlots: ProvidedSlotSpec[];
    constructor(slotModel: SerializedSlotSpec);
    getProvidedSlotSpec(name: any): ProvidedSlotSpec;
}
declare type SerializedProvidedSlotSpec = {
    name: string;
    isRequired?: boolean;
    isSet?: boolean;
    tags?: string[];
    formFactor?: string;
    handles?: string[];
};
export declare class ProvidedSlotSpec {
    name: string;
    isRequired: boolean;
    isSet: boolean;
    tags: string[];
    formFactor: string;
    handles: string[];
    constructor(slotModel: SerializedProvidedSlotSpec);
}
declare type SerializedParticleSpec = {
    name: string;
    id?: string;
    verbs: string[];
    args: SerializedConnectionSpec[];
    description: {
        pattern?: string;
    };
    implFile: string;
    modality: string[];
    slots: SerializedSlotSpec[];
};
export declare class ParticleSpec {
    private readonly model;
    name: string;
    verbs: string[];
    connections: ConnectionSpec[];
    connectionMap: Map<string, ConnectionSpec>;
    inputs: ConnectionSpec[];
    outputs: ConnectionSpec[];
    pattern: string;
    implFile: string;
    modality: Modality;
    slots: Map<string, SlotSpec>;
    constructor(model: SerializedParticleSpec);
    createConnection(arg: SerializedConnectionSpec, typeVarMap: Map<string, Type>): ConnectionSpec;
    isInput(param: string): boolean;
    isOutput(param: string): boolean;
    getSlotSpec(slotName: string): SlotSpec;
    readonly primaryVerb: string;
    isCompatible(modality: Modality): boolean;
    toLiteral(): SerializedParticleSpec;
    static fromLiteral(literal: SerializedParticleSpec): ParticleSpec;
    clone(): ParticleSpec;
    equals(other: any): boolean;
    validateDescription(description: any): void;
    toInterface(): InterfaceType;
    toString(): string;
    toManifestString(): string;
}
export {};
