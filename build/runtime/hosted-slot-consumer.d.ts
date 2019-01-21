/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Arc } from './arc.js';
import { HostedSlotContext } from './hosted-slot-context.js';
import { SlotConnection } from './recipe/slot-connection.js';
import { SlotConsumer } from './slot-consumer.js';
export declare class HostedSlotConsumer extends SlotConsumer {
    readonly transformationSlotConsumer: SlotConsumer;
    readonly hostedParticleName: string;
    readonly hostedSlotName: string;
    readonly hostedSlotId: string;
    readonly storeId: string;
    renderCallback: ({}: {}, {}: {}, {}: {}, {}: {}) => void;
    constructor(arc: Arc, transformationSlotConsumer: any, hostedParticleName: any, hostedSlotName: any, hostedSlotId: any, storeId: any);
    consumeConn: SlotConnection;
    setContent(content: any, handler: any, description: any): any;
    constructRenderRequest(): string[];
    getInnerContainer(name: any): any;
    createProvidedContexts(): HostedSlotContext[];
    updateProvidedContexts(): void;
}
