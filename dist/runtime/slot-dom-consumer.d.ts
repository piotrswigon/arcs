/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { SlotConsumer } from './slot-consumer.js';
import { SlotConnection } from './recipe/slot-connection.js';
export declare class SlotDomConsumer extends SlotConsumer {
    private readonly _observer;
    constructor(consumeConn?: SlotConnection, containerKind?: string);
    constructRenderRequest(hostedSlotConsumer: any): string[];
    static hasTemplate(templatePrefix: any): any;
    isSameContainer(container: any, contextContainer: any): boolean;
    createNewContainer(contextContainer: any, subId: any): ShadowRoot;
    deleteContainer(container: any): void;
    formatContent(content: any, subId: any): object;
    _modelForSingletonSlot(model: any, subId: any): any;
    _modelForSetSlotConsumedAsSetSlot(model: any, subId: any): any;
    _modelForSetSlotConsumedAsSingletonSlot(model: any, subId: any): any;
    setContainerContent(rendering: any, content: any, subId: any): void;
    clearContainer(rendering: any): void;
    dispose(): void;
    static clear(container: any): void;
    static dispose(): void;
    static findRootContainers(topContainer: any): {};
    createTemplateElement(template: any): HTMLTemplateElement & {
        innerHTML: any;
    };
    readonly templatePrefix: string;
    _setTemplate(rendering: any, templatePrefix: any, templateName: any, template: any): void;
    _onUpdate(rendering: any): void;
    _observe(container: any): void;
    _stampTemplate(rendering: any, template: any): void;
    _updateModel(rendering: any): void;
    initInnerContainers(container: any): void;
    getNodeValue(node: any, name: any): any;
    isDirectInnerSlot(container: any, innerContainer: any): boolean;
    _initMutationObserver(): MutationObserver;
    _eventMapper(eventHandler: any, node: any, eventName: any, handlerName: any): void;
    formatHostedContent(hostedSlot: any, content: any): {};
}
