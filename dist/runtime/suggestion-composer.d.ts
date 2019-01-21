/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Modality } from './modality.js';
import { SlotComposer } from './slot-composer.js';
import { Suggestion } from './plan/suggestion.js';
export declare class SuggestionComposer {
    private _container;
    private readonly _slotComposer;
    private _suggestions;
    private _suggestConsumers;
    constructor(slotComposer: SlotComposer);
    readonly modality: Modality;
    clear(): void;
    setSuggestions(suggestions: Suggestion[]): void;
    private _addInlineSuggestion;
}
