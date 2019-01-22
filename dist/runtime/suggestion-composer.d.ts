/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { ModalityHandler } from './modality-handler.js';
import { SlotComposer } from './slot-composer.js';
import { Arc } from './arc.js';
import { Suggestion } from './plan/suggestion.js';
import { SuggestDomConsumer } from './suggest-dom-consumer.js';
export declare class SuggestionComposer {
    private _container;
    private readonly _slotComposer;
    private readonly arc;
    private _suggestions;
    protected readonly _suggestConsumers: SuggestDomConsumer[];
    constructor(arc: Arc, slotComposer: SlotComposer);
    readonly modalityHandler: ModalityHandler;
    clear(): void;
    setSuggestions(suggestions: Suggestion[]): void;
    private _addInlineSuggestion;
}
