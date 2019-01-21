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
import { Arc } from './arc.js';
import { SlotContext } from './slot-context.js';
import { SlotConsumer } from './slot-consumer.js';
import { HostedSlotConsumer } from './hosted-slot-consumer.js';
import { Particle } from './recipe/particle.js';
export declare class SlotComposer {
    arc: Arc;
    private readonly _containerKind;
    private _modality;
    private _consumers;
    private _contexts;
    /**
     * |options| must contain:
     * - modality: the UI modality the slots composer render to (for example: dom).
     * - rootContainer: the top level container to be used for slots.
     * and may contain:
     * - containerKind: the type of container wrapping each slot-context's container  (for example, div).
     */
    constructor(options: any);
    readonly modality: Modality;
    readonly consumers: SlotConsumer[];
    readonly containerKind: string;
    getSlotConsumer(particle: Particle, slotName: string): SlotConsumer;
    findContainerByName(name: string): HTMLElement | undefined;
    findContextById(slotId: any): SlotContext;
    createHostedSlot(transformationParticle: any, transformationSlotName: any, hostedParticleName: any, hostedSlotName: any, storeId: any): string;
    _addSlotConsumer(slot: HostedSlotConsumer): void;
    initializeRecipe(recipeParticles: Particle[]): void;
    renderSlot(particle: Particle, slotName: string, content: any): Promise<void>;
    getAvailableContexts(): SlotContext[];
    dispose(): void;
}
