/**
 * @license
 * Copyright (c) 2019 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { AbstractSlotContext } from './slot-context.js';
import { SlotConsumer } from './slot-consumer.js';
export declare class CapturingSlotContext extends AbstractSlotContext {
    constructor(id: string, creatingSlotConsumer: SlotConsumer);
}
