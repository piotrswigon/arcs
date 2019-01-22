/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Arc } from './arc.js';
import { Description } from './description.js';
import { SlotContext, ProvidedSlotContext, HostedSlotContext } from './slot-context.js';
import { SlotConnection } from './recipe/slot-connection.js';
export declare class SlotConsumer {
    _consumeConn?: SlotConnection;
    slotContext: SlotContext;
    readonly directlyProvidedSlotContexts: ProvidedSlotContext[];
    readonly hostedSlotContexts: HostedSlotContext[];
    startRenderCallback: ({}: {}) => void;
    stopRenderCallback: ({}: {}) => void;
    eventHandler: ({}: {}) => void;
    readonly containerKind?: string;
    private _renderingBySubId;
    private innerContainerBySlotId;
    readonly arc: Arc;
    constructor(arc: Arc, consumeConn?: SlotConnection, containerKind?: string);
    readonly consumeConn: SlotConnection;
    getRendering(subId?: any): {
        container?: {};
        model?: any;
        templateName?: string;
    };
    readonly renderings: [string, {
        container?: {};
        model?: any;
        templateName?: string;
    }][];
    addRenderingBySubId(subId: string | undefined, rendering: any): void;
    addHostedSlotContexts(context: HostedSlotContext): void;
    readonly allProvidedSlotContexts: ProvidedSlotContext[];
    findProvidedContext(predicate: (_: ProvidedSlotContext) => boolean): ProvidedSlotContext;
    private generateProvidedContexts;
    onContainerUpdate(newContainer: any, originalContainer: any): void;
    createProvidedContexts(): ProvidedSlotContext[];
    updateProvidedContexts(): void;
    startRender(): void;
    stopRender(): void;
    setContent(content: any, handler: any, description?: Description): void;
    populateHandleDescriptions(description: Description): {};
    getInnerContainer(slotId: any): any;
    _initInnerSlotContainer(slotId: any, subId: any, container: any): void;
    _clearInnerSlotContainers(subIds: any): void;
    isSameContainer(container: any, contextContainer: any): boolean;
    constructRenderRequest(): string[];
    dispose(): void;
    createNewContainer(contextContainer: any, subId: any): {};
    deleteContainer(container: any): void;
    clearContainer(rendering: any): void;
    setContainerContent(rendering: any, content: any, subId: any): void;
    formatContent(content: any, subId: any): object;
    formatHostedContent(content: any): {};
    static clear(container: any): void;
}
