/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { SlotComposer, SlotComposerOptions } from '../slot-composer.js';
/**
 * A helper class for NodeJS tests that mimics SlotComposer without relying on DOM APIs.
 */
export declare class FakeSlotComposer extends SlotComposer {
    constructor(options?: SlotComposerOptions);
    renderSlot(particle: any, slotName: any, content: any): Promise<void>;
    readonly contexts: import("../slot-context.js").SlotContext[];
}
