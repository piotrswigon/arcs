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
import { StorageProviderBase } from '../storage/storage-provider-base.js';
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
    searchStore: StorageProviderBase;
    searchStoreCallback: ({}: {}) => void;
    debug: boolean;
    constructor(arc: Arc, result: PlanningResult, searchStore: StorageProviderBase, { debug }?: {
        debug?: boolean;
    });
    isPlanning: boolean;
    registerStateChangedCallback(callback: any): void;
    onSearchChanged(): Promise<void>;
    dispose(): void;
    produceSuggestions(options?: {}): Promise<void>;
    runPlanner(options: any, generations: any): Promise<any[]>;
    private _cancelPlanning;
    private _updateResult;
}
