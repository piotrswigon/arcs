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
import { Planner } from '../planner.js';
import { PlanningResult } from './planning-result.js';
import { RecipeIndex } from '../recipe-index.js';
import { Speculator } from '../speculator.js';
import { Suggestion } from './suggestion.js';
import { VariableStorageProvider } from '../storage/storage-provider-base.js';
import { ArcDevtoolsChannel } from '../debug/abstract-devtools-channel.js';
export declare enum Trigger {
    Init = "init",
    Search = "search",
    PlanInstantiated = "plan-instantiated",
    DataChanged = "data-changed",
    Forced = "forced"
}
export declare class PlanProducer {
    arc: Arc;
    result: PlanningResult;
    planner: Planner | null;
    recipeIndex: RecipeIndex;
    speculator: Speculator;
    needReplan: boolean;
    replanOptions: {};
    _isPlanning: boolean;
    stateChangedCallbacks: ((isPlanning: boolean) => void)[];
    search: string;
    searchStore?: VariableStorageProvider;
    searchStoreCallback: ({}: {}) => void;
    debug: boolean;
    devtoolsChannel: ArcDevtoolsChannel;
    constructor(arc: Arc, result: PlanningResult, searchStore?: VariableStorageProvider, { debug }?: {
        debug?: boolean;
    });
    isPlanning: boolean;
    registerStateChangedCallback(callback: any): void;
    onSearchChanged(): Promise<void>;
    dispose(): void;
    produceSuggestions(options?: {}): Promise<void>;
    runPlanner(options: any, generations: any): Promise<Suggestion[]>;
    protected _cancelPlanning(): void;
    private _updateResult;
}
