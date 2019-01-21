/** @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { ParticleExecutionContext } from './particle-execution-context.js';
import { ReferenceType } from './type.js';
export declare class Reference {
    entity: any;
    type: ReferenceType;
    private readonly id;
    private storageKey;
    private readonly context;
    private storageProxy;
    protected handle: any;
    constructor(data: {
        id: string;
        storageKey: string | null;
    }, type: ReferenceType, context: ParticleExecutionContext);
    protected ensureStorageProxy(): Promise<void>;
    dereference(): Promise<void>;
    dataClone(): {
        storageKey: string;
        id: string;
    };
    static newClientReference(context: ParticleExecutionContext): typeof Reference;
}
