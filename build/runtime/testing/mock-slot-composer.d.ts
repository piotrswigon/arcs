/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Particle } from '../recipe/particle.js';
import { SlotComposerOptions } from '../slot-composer.js';
import { FakeSlotComposer } from './fake-slot-composer.js';
declare type MockSlotComposerOptions = {
    strict?: boolean;
    logging?: boolean;
};
/**
 * A helper SlotComposer allowing expressing and asserting expectations on slot rendering.
 * Usage example:
 *   mockSlotComposer
 *       .newExpectations()
 *           .expectRenderSlot('MyParticle1', 'mySlot1', {contentTypes: ['template']});
 *           .expectRenderSlot('MyParticle1', 'mySlot1', {contentTypes: ['model'], times: 2})
 *           .expectRenderSlot('MyParticle2', 'mySlot2', {verify: (content) => !!content.myParam})
 *           .expectRenderSlot('MyOptionalParticle', 'myOptionalSlot', {contentTypes: ['template', 'model'], isOptional: true})
 *   mockSlotComposer.sendEvent('MyParticle1', 'mySlot1', '_onMyEvent', {key: 'value'});
 *   await mockSlotComposer.expectationsCompleted();
 */
export declare class MockSlotComposer extends FakeSlotComposer {
    private expectQueue;
    onExpectationsComplete: any;
    strict: boolean;
    logging: boolean;
    debugMessages: any;
    pec: any;
    /**
     * |options| may contain:
     * - strict: whether unexpected render slot requests cause an assert or a warning log (default: true)
     */
    constructor(options?: SlotComposerOptions & MockSlotComposerOptions);
    _addSlotConsumer(slot: any): void;
    /**
     * Reinitializes expectations queue.
     */
    newExpectations(name?: string): MockSlotComposer;
    /**
     * Allows ignoring unexpected render slot requests.
     */
    ignoreUnexpectedRender(): this;
    /**
     * Returns true, if the number of items in content's model is equal to the given number.
     */
    expectContentItemsNumber(num: number, content: any): boolean;
    /**
     * Adds a rendering expectation for the given particle and slot names, where options may contain:
     * times: number of time the rendering request will occur
     * contentTypes: the types appearing in the rendering content
     * isOptional: whether this expectation is optional (default: false)
     * hostedParticle: for transformation particles, the name of the hosted particle
     * verify: an additional optional handler that determines whether the incoming render request satisfies the expectation
     */
    expectRenderSlot(particleName: any, slotName: any, options: any): this;
    /**
     * Returns promise to completion of all expectations.
     */
    expectationsCompleted(): Promise<void> | Promise<{}>;
    assertExpectationsCompleted(): boolean;
    /**
     * Sends an event to the given particle and slot.
     */
    sendEvent(particleName: any, slotName: any, event: any, data: any): void;
    _addRenderExpectation(expectation: any): this;
    _canIgnore(particleName: string, slotName: string, content: any): boolean;
    _getHostedParticleNames(particle: Particle): any[];
    _verifyRenderContent(particle: any, slotName: any, content: any): boolean;
    renderSlot(particle: any, slotName: any, content: any): Promise<void>;
    _expectationsMet(): void;
    detailedLogDebug(): this;
    _addDebugMessages(message: any): void;
    debugMessagesToString(): string;
}
export {};
