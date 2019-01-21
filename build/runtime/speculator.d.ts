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
import { PlanningResult } from './plan/planning-result.js';
import { Recipe } from './recipe/recipe.js';
import { Suggestion } from './plan/suggestion.js';
export declare class Speculator {
    private suggestionByHash;
    private speculativeArcs;
    constructor(planningResult?: PlanningResult);
    speculate(arc: Arc, plan: Recipe, hash: string): Promise<Suggestion | null>;
    awaitCompletion(relevance: any, speculativeArc: any): any;
    dispose(): void;
}
