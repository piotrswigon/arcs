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
import { Description } from '../description.js';
import { DescriptionFormatter } from '../description-formatter.js';
import { Manifest } from '../manifest.js';
import { Modality } from '../modality.js';
import { Recipe } from '../recipe/recipe.js';
import { Relevance } from '../relevance.js';
import { Search } from '../recipe/search.js';
import { Loader } from '../loader.js';
/**
 * options for the fromLiteral() method.
 */
export declare type FromLiteralOptions = {
    plan: string;
    hash: string;
    rank: number;
    versionByStore?: string;
    searchGroups?: string[][];
    descriptionByModality?: {};
};
export declare type EnvOptions = {
    context: Manifest;
    loader: Loader;
};
export declare class Suggestion {
    plan: Recipe;
    planString: string;
    descriptionByModality: {};
    versionByStore: {};
    readonly hash: string;
    readonly rank: number;
    groupIndex: number;
    searchGroups: string[][];
    static create(plan: Recipe, hash: string, relevance: Relevance): Suggestion;
    constructor(plan: Recipe, hash: string, rank: number, versionByStore: {});
    readonly descriptionText: string;
    getDescription(modality: string): string | {};
    setDescription(description: Description, modality: Modality, descriptionFormatter?: typeof DescriptionFormatter): void;
    isEquivalent(other: Suggestion): boolean;
    static compare(s1: Suggestion, s2: Suggestion): number;
    hasSearch(search: string): boolean;
    setSearch(search: Search): void;
    mergeSearch(suggestion: Suggestion): boolean;
    _addSearch(searchGroup: string[]): boolean;
    toLiteral(): {
        plan: string;
        hash: string;
        rank: number;
        versionByStore: string;
        searchGroups: string[][];
        descriptionByModality: {};
    };
    static fromLiteral({ plan, hash, rank, versionByStore, searchGroups, descriptionByModality }: FromLiteralOptions, { context, loader }: EnvOptions): Promise<Suggestion>;
    instantiate(arc: Arc): Promise<void>;
    getResolvedPlan(arc: Arc): Promise<Recipe>;
}
