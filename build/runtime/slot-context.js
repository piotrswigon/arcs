/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { assert } from '../platform/assert-web.js';
import { ProvidedSlotSpec } from './particle-spec.js';
/**
 * Represents a single slot in the rendering system.
 */
export class SlotContext {
    constructor(id, sourceSlotConsumer = null) {
        this.slotConsumers = [];
        this.id = id;
        this.sourceSlotConsumer = sourceSlotConsumer;
    }
    addSlotConsumer(slotConsumer) {
        this.slotConsumers.push(slotConsumer);
        slotConsumer.slotContext = this;
    }
    clearSlotConsumers() {
        this.slotConsumers.forEach(slotConsumer => slotConsumer.slotContext = null);
        this.slotConsumers.length = 0;
    }
}
/**
 * Represents a slot created by a transformation particle in the inner arc.
 *
 * Render calls for that slot are routed to the transformation particle,
 * which receives them as innerArcRender calls.
 *
 * TODO:
 * Today startRender/stopRender calls for particles rendering into this slot are governed by the
 * availability of the container on the transformation particle. This should be optional and only
 * used if the purpose of the innerArc is rendering to the outer arc. It should be possible for
 * the particle which doesn't consume a slot to create an inner arc with hosted slots, which
 * today is not feasible.
 */
export class HostedSlotContext extends SlotContext {
    constructor(id, transformationSlotConsumer, storeId) {
        super(id, transformationSlotConsumer);
        this._containerAvailable = false;
        assert(transformationSlotConsumer);
        this.storeId = storeId;
        transformationSlotConsumer.addHostedSlotContexts(this);
    }
    onRenderSlot(consumer, content, handler) {
        this.sourceSlotConsumer.arc.pec.innerArcRender(this.sourceSlotConsumer.consumeConn.particle, this.sourceSlotConsumer.consumeConn.name, this.id, consumer.formatHostedContent(content));
    }
    addSlotConsumer(consumer) {
        super.addSlotConsumer(consumer);
        if (this.containerAvailable)
            consumer.startRender();
    }
    get containerAvailable() { return this._containerAvailable; }
    set containerAvailable(containerAvailable) {
        if (this._containerAvailable === containerAvailable)
            return;
        this._containerAvailable = containerAvailable;
        for (const consumer of this.slotConsumers) {
            if (containerAvailable) {
                consumer.startRender();
            }
            else {
                consumer.stopRender();
            }
        }
    }
}
/**
 * Represents a slot provided by a particle through a provide connection or one of the root slots
 * provided by the shell. Holds container (eg div element) and its additional info.
 * Must be initialized either with a container (for root slots provided by the shell) or
 * tuple of sourceSlotConsumer and spec (ProvidedSlotSpec) of the slot.
 */
export class ProvidedSlotContext extends SlotContext {
    constructor(id, name, tags, container, spec, sourceSlotConsumer = null) {
        super(id, sourceSlotConsumer);
        this.tags = [];
        assert(Boolean(container) !== Boolean(spec), `Exactly one of either container or slotSpec may be set`);
        assert(Boolean(spec) === Boolean(spec), `Spec and source slot can only be set together`);
        this.name = name;
        this.tags = tags || [];
        this._container = container;
        // The context's accompanying ProvidedSlotSpec (see particle-spec.js).
        // Initialized to a default spec, if the container is one of the shell provided top root-contexts.
        this.spec = spec || new ProvidedSlotSpec({ name });
        if (this.sourceSlotConsumer) {
            this.sourceSlotConsumer.directlyProvidedSlotContexts.push(this);
        }
        // The list of handles this context is restricted to.
        this.handles = this.spec && this.sourceSlotConsumer
            ? this.spec.handles.map(handle => this.sourceSlotConsumer.consumeConn.particle.connections[handle].handle).filter(a => a !== undefined)
            : [];
    }
    onRenderSlot(consumer, content, handler, description) {
        consumer.setContent(content, handler, description);
    }
    get container() { return this._container; }
    get containerAvailable() { return !!this._container; }
    static createContextForContainer(id, name, container, tags) {
        return new ProvidedSlotContext(id, name, tags, container, null);
    }
    isSameContainer(container) {
        if (this.spec.isSet) {
            if (Boolean(this.container) !== Boolean(container)) {
                return false;
            }
            if (!this.container) {
                return true;
            }
            return Object.keys(this.container).length === Object.keys(container).length &&
                Object.keys(this.container).every(key => Object.keys(container).some(newKey => newKey === key)) &&
                Object.values(this.container).every(currentContainer => Object.values(container).some(newContainer => newContainer === currentContainer));
        }
        return (!container && !this.container) || (this.container === container);
    }
    set container(container) {
        if (this.isSameContainer(container)) {
            return;
        }
        const originalContainer = this.container;
        this._container = container;
        this.slotConsumers.forEach(slotConsumer => slotConsumer.onContainerUpdate(this.container, originalContainer));
    }
    addSlotConsumer(slotConsumer) {
        super.addSlotConsumer(slotConsumer);
        if (this.container) {
            slotConsumer.onContainerUpdate(this.container, null);
        }
    }
}
//# sourceMappingURL=slot-context.js.map