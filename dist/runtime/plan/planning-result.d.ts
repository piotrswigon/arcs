/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { StorageProviderBase } from '../storage/storage-provider-base.js';
import { Suggestion } from './suggestion.js';
export declare class PlanningResult {
    _suggestions: Suggestion[];
    lastUpdated: Date;
    generations: {}[];
    contextual: boolean;
    store: StorageProviderBase;
    private storeCallback;
    private changeCallbacks;
    constructor(store: any);
    registerChangeCallback(callback: any): void;
    onChanged(): void;
    load(): Promise<boolean>;
    flush(): Promise<void>;
    clear(): Promise<any>;
    dispose(): void;
    suggestions: Suggestion[];
    static formatSerializableGenerations(generations: any): any;
    set({ suggestions, lastUpdated, generations, contextual }: {
        suggestions: any;
        lastUpdated?: Date;
        generations?: any[];
        contextual?: boolean;
    }): boolean;
    append({ suggestions, lastUpdated, generations }: {
        suggestions: any;
        lastUpdated?: Date;
        generations?: any[];
    }): boolean;
    olderThan(other: any): boolean;
    isEquivalent(suggestions: any): any;
    static isEquivalent(oldSuggestions: any, newSuggestions: any): any;
    fromLiteral({ suggestions, generations, lastUpdated }: {
        suggestions: any;
        generations: any;
        lastUpdated: any;
    }): boolean;
    toLiteral(): {};
}
