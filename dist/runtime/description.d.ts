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
import { DescriptionFormatter, DescriptionValue, ParticleDescription } from './description-formatter.js';
import { Particle } from './recipe/particle.js';
import { Relevance } from './relevance.js';
export declare class Description {
    private readonly particleDescriptions;
    private readonly storeDescById;
    private readonly arcRecipeName;
    private readonly arcRecipes;
    private constructor();
    static create(arc: Arc, relevance?: Relevance): Promise<Description>;
    getArcDescription(formatterClass?: typeof DescriptionFormatter): Promise<string>;
    getRecipeSuggestion(formatterClass?: typeof DescriptionFormatter): any;
    getHandleDescription(recipeHandle: any): any;
    static _getStoreDescById(arc: Arc): {};
    static initDescriptionHandles(arc: Arc, relevance?: Relevance): Promise<any[]>;
    static _createParticleDescription(particle: Particle, arc: Arc, relevance?: Relevance): Promise<ParticleDescription>;
    static _getPatternByNameFromDescriptionHandle(particle: Particle, arc: Arc): Promise<{}>;
    static _prepareStoreValue(store: any): Promise<DescriptionValue>;
    static defaultDescription: string;
}
