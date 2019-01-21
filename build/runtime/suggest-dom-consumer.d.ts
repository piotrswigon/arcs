/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { SlotDomConsumer } from './slot-dom-consumer.js';
import { Suggestion } from './plan/suggestion.js';
import { Arc } from './arc.js';
export declare class SuggestDomConsumer extends SlotDomConsumer {
    _suggestion: Suggestion;
    _suggestionContent: any;
    _eventHandler: any;
    constructor(arc: Arc, containerKind: string, suggestion: Suggestion, suggestionContent: any, eventHandler: any);
    readonly suggestion: Suggestion;
    readonly templatePrefix: string;
    formatContent(content: any): {
        template: string;
        templateName: string;
        model: any;
    };
    onContainerUpdate(container: any, originalContainer: any): void;
    static render(arc: Arc, container: any, plan: any, content: any): SlotDomConsumer;
}
