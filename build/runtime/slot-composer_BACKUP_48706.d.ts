/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Modality } from './modality.js';
import { ModalityHandler } from './modality-handler.js';
import { Arc } from './arc.js';
import { SlotContext } from './slot-context.js';
import { SlotConsumer } from './slot-consumer.js';
import { HostedSlotConsumer } from './hosted-slot-consumer.js';
import { Particle } from './recipe/particle.js';
export declare class SlotComposer {
    private readonly _containerKind;
    readonly modality: Modality;
    readonly modalityHandler: ModalityHandler;
    private _consumers;
    private _contexts;
    /**
     * |options| must contain:
     * - modalityName: the UI modality the slot-composer renders to (for example: dom).
     * - modalityHandler: the handler for UI modality the slot-composer renders to.
     * - rootContainer: the top level container to be used for slots.
     * and may contain:
     * - containerKind: the type of container wrapping each slot-context's container  (for example, div).
     */
    constructor(options: any);
    readonly consumers: SlotConsumer[];
    readonly containerKind: string;
    getSlotConsumer(particle: Particle, slotName: string): SlotConsumer;
    findContainerByName(name: string): HTMLElement | undefined;
    findContextById(slotId: any): SlotContext;
    createHostedSlot(transformationParticle: any, transformationSlotName: any, hostedParticleName: any, hostedSlotName: any, storeId: any): string;
    _addSlotConsumer(slot: HostedSlotConsumer): void;
    initializeRecipe(arc: Arc, recipeParticles: Particle[]): void;
    renderSlot(particle: Particle, slotName: string, content: any): Promise<void>;
    getAvailableContexts(): SlotContext[];
    dispose(arc: Arc): void;
}
