/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { SlotConsumer } from './slot-consumer.js';
import { ProvidedSlotSpec } from './particle-spec.js';
import { Handle } from './recipe/handle.js';
/**
 * Holds container (eg div element) and its additional info.
 * Must be initialized either with a container (for root slots provided by the shell) or
 * tuple of sourceSlotConsumer and spec (ProvidedSlotSpec) of the slot.
 */
export declare class SlotContext {
    readonly id: string;
    readonly name: string;
    readonly tags: string[];
    private _container;
    spec: ProvidedSlotSpec;
    readonly sourceSlotConsumer: SlotConsumer;
    slotConsumers: SlotConsumer[];
    handles: Handle[];
    constructor(id: string, name: string, tags: string[], container: HTMLElement, spec: ProvidedSlotSpec, sourceSlotConsumer?: SlotConsumer);
    container: HTMLElement;
    static createContextForContainer(id: any, name: any, container: any, tags: any): SlotContext;
    isSameContainer(container: any): boolean;
    addSlotConsumer(slotConsumer: any): void;
    clearSlotConsumers(): void;
}
