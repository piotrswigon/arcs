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
import { Recipe } from '../recipe/recipe.js';
import { Relevance } from '../relevance.js';
import { Search } from '../recipe/search.js';
export declare class Plan {
    serialization: string;
    particles: {
        name: string;
    }[];
    handles: {
        id: string;
        tags: string[];
    }[];
    slots: {
        id: string;
        name: string;
        tags: string[];
    }[];
    modalities: string[];
    constructor(serialization: string, particles: {
        name: string;
    }[], handles: {
        id: string;
        tags: string[];
    }[], slots: {
        id: string;
        name: string;
        tags: string[];
    }[], modalities: string[]);
    static create(plan: Recipe): Plan;
}
export declare class Suggestion {
    plan: Plan;
    descriptionByModality: {};
    versionByStore: {};
    readonly hash: string;
    readonly rank: number;
    groupIndex: number;
    searchGroups: string[][];
    static create(plan: Recipe, hash: string, relevance: Relevance): Suggestion;
    constructor(plan: Plan, hash: string, rank: number, versionByStore: {});
    readonly descriptionText: string;
    getDescription(modality: string): string | {};
    setDescription(description: Description): Promise<void>;
    isEquivalent(other: Suggestion): boolean;
    static compare(s1: Suggestion, s2: Suggestion): number;
    hasSearch(search: string): boolean;
    setSearch(search: Search): void;
    mergeSearch(suggestion: Suggestion): boolean;
    _addSearch(searchGroup: string[]): boolean;
    toLiteral(): {
        plan: Plan;
        hash: string;
        rank: number;
        versionByStore: string;
        searchGroups: string[][];
        descriptionByModality: {};
    };
    static fromLiteral({ plan, hash, rank, versionByStore, searchGroups, descriptionByModality }: {
        plan: any;
        hash: any;
        rank: any;
        versionByStore: any;
        searchGroups: any;
        descriptionByModality: any;
    }): Suggestion;
    instantiate(arc: Arc): Promise<void>;
    static planFromString(planString: string, arc: Arc): Promise<Recipe>;
}
