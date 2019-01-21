/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Handle } from './handle.js';
import { ConnectionSpec, ParticleSpec } from './particle-spec.js';
import { Relevance } from './relevance.js';
/**
 * A basic particle. For particles that provide UI, you may like to
 * instead use DOMParticle.
 */
export declare class Particle {
    static spec: ParticleSpec;
    spec: ParticleSpec;
    extraData: boolean;
    relevances: Relevance[];
    handles: Map<string, Handle>;
    consumedSlotConnections: any[];
    private _idle;
    private _idleResolver;
    private _busy;
    slotByName: Map<string, any>;
    private capabilities;
    constructor(capabilities?: {
        constructInnerArc?: Function;
    });
    /**
     * This method is invoked with a handle for each store this particle
     * is registered to interact with, once those handles are ready for
     * interaction. Override the method to register for events from
     * the handles.
     *
     * @param handles a map from handle names to store handles.
     */
    setHandles(handles: Map<string, Handle>): void;
    /**
     * This method is deprecated. Use setHandles instead.
     */
    setViews(views: any): void;
    /**
     * Called for handles that are configured with both keepSynced and notifySync, when they are
     * updated with the full model of their data. This will occur once after setHandles() and any time
     * thereafter if the handle is resynchronized.
     *
     * @param handle The Handle instance that was updated.
     * @param model For Variable-backed Handles, the Entity data or null if the Variable is not set.
     *        For Collection-backed Handles, the Array of Entities, which may be empty.
     */
    onHandleSync(handle: Handle, model: any): void;
    /**
     * Called for handles that are configued with notifyUpdate, when change events are received from
     * the backing store. For handles also configured with keepSynced these events will be correctly
     * ordered, with some potential skips if a desync occurs. For handles not configured with
     * keepSynced, all change events will be passed through as they are received.
     *
     * @param handle The Handle instance that was updated.
     * @param update An object containing one of the following fields:
     *  - data: The full Entity for a Variable-backed Handle.
     *  - added: An Array of Entities added to a Collection-backed Handle.
     *  - removed: An Array of Entities removed from a Collection-backed Handle.
     */
    onHandleUpdate(handle: Handle, update: {
        data?: any;
        added?: any;
        removed?: any;
        originator?: any;
    }): void;
    /**
     * Called for handles that are configured with both keepSynced and notifyDesync, when they are
     * detected as being out-of-date against the backing store. For Variables, the event that triggers
     * this will also resync the data and thus this call may usually be ignored. For Collections, the
     * underlying proxy will automatically request a full copy of the stored data to resynchronize.
     * onHandleSync will be invoked when that is received.
     *
     * @param handle The Handle instance that was desynchronized.
     */
    onHandleDesync(handle: Handle): void;
    constructInnerArc(): any;
    readonly busy: boolean;
    readonly idle: Promise<void>;
    relevance: Relevance;
    startBusy(): void;
    doneBusy(): void;
    inputs(): ConnectionSpec[];
    outputs(): ConnectionSpec[];
    /**
     * Returns the slot with provided name.
     */
    getSlot(name: any): any;
    static buildManifest(strings: string[], ...bits: any[]): string;
    setParticleDescription(pattern: any): boolean;
    setDescriptionPattern(connectionName: string, pattern: any): boolean;
    renderSlot(slotName: string, contentTypes: string[]): void;
    renderHostedSlot(slotName: string, hostedSlotId: string, content: string): void;
    fireEvent(slotName: string, event: {}): void;
}
