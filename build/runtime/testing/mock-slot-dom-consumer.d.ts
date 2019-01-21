/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { SlotDomConsumer } from '../slot-dom-consumer.js';
export declare class MockSlotDomConsumer extends SlotDomConsumer {
    _content: any;
    contentAvailable: any;
    _contentAvailableResolve: any;
    constructor(arc: any, consumeConn: any);
    setContent(content: any, handler: any, description: any): void;
    createNewContainer(container: any, subId: any): any;
    isSameContainer(container: any, contextContainer: any): boolean;
    getInnerContainer(slotId: any): any;
    createTemplateElement(template: any): any;
    static findRootContainers(container: any): any;
    static clear(container: any): void;
    _onUpdate(rendering: any): void;
    _stampTemplate(template: any): void;
    _initMutationObserver(): MutationObserver;
    _observe(): void;
}
