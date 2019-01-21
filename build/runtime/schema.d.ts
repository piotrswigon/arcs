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
import { EntityClass } from './entity.js';
import { ParticleExecutionContext } from './particle-execution-context.js';
export declare class Schema {
    readonly names: string[];
    readonly fields: {
        [index: string]: any;
    };
    description: {
        [index: string]: string;
    };
    isAlias: boolean;
    constructor(names: string[], fields: {
        [index: string]: any;
    }, description?: any);
    toLiteral(): {
        names: string[];
        fields: {};
        description: {
            [index: string]: string;
        };
    };
    static fromLiteral(data?: {
        fields: {};
        names: any[];
        description: {};
    }): Schema;
    readonly name: string;
    static typesEqual(fieldType1: any, fieldType2: any): boolean;
    static _typeString(type: any): string;
    static union(schema1: Schema, schema2: Schema): Schema;
    static intersect(schema1: Schema, schema2: Schema): Schema;
    equals(otherSchema: Schema): boolean;
    isMoreSpecificThan(otherSchema: Schema): boolean;
    readonly type: Type;
    entityClass(context?: ParticleExecutionContext): EntityClass;
    toInlineSchemaString(options?: {
        hideFields?: boolean;
    }): string;
    toManifestString(): string;
}
