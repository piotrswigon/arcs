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
export class CapturingSlotContext extends AbstractSlotContext {
    // This is a context of a hosted slot, can only contain a hosted slot.
    constructor(id, creatingSlotConsumer) {
        super(id, creatingSlotConsumer);
    }
}
//# sourceMappingURL=capturing-slot-context.js.map