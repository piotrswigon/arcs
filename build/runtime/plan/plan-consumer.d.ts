/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Arc } from '../arc.js';
import { PlanningResult } from './planning-result.js';
import { Suggestion } from './suggestion.js';
import { SuggestionComposer } from '../suggestion-composer.js';
import { ArcDevtoolsChannel } from '../debug/abstract-devtools-channel.js';
export declare class PlanConsumer {
    arc: Arc;
    result: PlanningResult;
    suggestFilter: {
        showAll: boolean;
        search?: any;
    };
    private suggestionsChangeCallbacks;
    private visibleSuggestionsChangeCallbacks;
    suggestionComposer: SuggestionComposer | null;
    currentSuggestions: Suggestion[];
    devtoolsChannel: ArcDevtoolsChannel;
    constructor(arc: Arc, result: PlanningResult);
    registerSuggestionsChangedCallback(callback: any): void;
    registerVisibleSuggestionsChangedCallback(callback: any): void;
    setSuggestFilter(showAll: boolean, search?: string): void;
    onSuggestionsChanged(): void;
    getCurrentSuggestions(): Suggestion[];
    dispose(): void;
    _onSuggestionsChanged(): void;
    _onMaybeSuggestionsChanged(): void;
    _initSuggestionComposer(): void;
}
