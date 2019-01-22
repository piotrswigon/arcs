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
import { SlotContext, ProvidedSlotContext } from './slot-context.js';
import { SlotConsumer } from './slot-consumer.js';
import { Particle } from './recipe/particle.js';
export declare type SlotComposerOptions = {
    modalityName?: string;
    modalityHandler?: ModalityHandler;
    noRoot?: boolean;
    rootContainer?: any;
    rootContext?: any;
    containerKind?: string;
    containers?: any;
};
export declare class SlotComposer {
    private readonly _containerKind;
    readonly modality: Modality;
    readonly modalityHandler: ModalityHandler;
    private _consumers;
    protected _contexts: SlotContext[];
    /**
     * |options| must contain:
     * - modalityName: the UI modality the slot-composer renders to (for example: dom).
     * - modalityHandler: the handler for UI modality the slot-composer renders to.
     * - rootContainer: the top level container to be used for slots.
     * and may contain:
     * - containerKind: the type of container wrapping each slot-context's container  (for example, div).
     */
    constructor(options: SlotComposerOptions);
    readonly consumers: SlotConsumer[];
    readonly containerKind: string;
    getSlotConsumer(particle: Particle, slotName: string): SlotConsumer;
    findContainerByName(name: string): HTMLElement | undefined;
    findContextsByName(name: string): ProvidedSlotContext[];
    findContextById(slotId: any): SlotContext;
    createHostedSlot(innerArc: Arc, transformationParticle: Particle, transformationSlotName: string, storeId: string): string;
    _addSlotConsumer(slot: SlotConsumer): void;
    initializeRecipe(arc: Arc, recipeParticles: Particle[]): void;
    renderSlot(particle: Particle, slotName: string, content: any): Promise<void>;
    getAvailableContexts(): SlotContext[];
    dispose(): void;
}
