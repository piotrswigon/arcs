/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Handle } from './recipe/handle.js';
import { Particle } from './recipe/particle.js';
import { HandleConnection } from './recipe/handle-connection.js';
export declare type ParticleDescription = {
    _particle: Particle;
    pattern?: string;
    _connections: {
        [index: string]: HandleDescription;
    };
    _rank?: number;
};
export declare type HandleDescription = {
    pattern: string;
    _handleConn: HandleConnection;
    value: DescriptionValue;
};
export declare type DescriptionValue = {
    entityValue?: string | {};
    valueDescription?: string;
    collectionValues?: string[];
    bigCollectionValues?: string[];
    interfaceValue?: string | {};
};
export declare type CombinedDescriptionsOptions = {
    skipFormatting?: boolean;
};
export declare class DescriptionFormatter {
    private readonly particleDescriptions;
    private readonly storeDescById;
    private seenHandles;
    seenParticles: Set<Particle>;
    excludeValues: boolean;
    constructor(particleDescriptions?: ParticleDescription[], storeDescById?: {
        [id: string]: string;
    });
    getDescription(recipe: {
        patterns: string[];
        particles: Particle[];
    }): any;
    _isSelectedDescription(desc: ParticleDescription): boolean;
    getHandleDescription(recipeHandle: Handle): any;
    _combineSelectedDescriptions(selectedDescriptions: ParticleDescription[], options?: CombinedDescriptionsOptions): any;
    _joinDescriptions(strings: any): any;
    _joinTokens(tokens: any): any;
    _capitalizeAndPunctuate(sentence: any): string;
    patternToSuggestion(pattern: any, particleDescription: any): any;
    _initTokens(pattern: any, particleDescription: any): any[];
    _initSubTokens(pattern: any, particleDescription: any): {}[];
    tokenToString(token: any): any;
    _particleTokenToString(token: any): any;
    _handleTokenToString(token: any): any;
    _combineDescriptionAndValue(token: any, description: any, storeValue: any): any;
    _slotTokenToString(token: any): any;
    _propertyTokenToString(handleName: string, value: DescriptionValue, properties: string[]): any;
    _formatEntityProperty(handleName: any, properties: any, value: any): any;
    _formatStoreValue(handleName: string, value: DescriptionValue): any;
    _formatCollection(handleName: any, values: any): any;
    _formatBigCollection(handleName: any, firstValue: any): any;
    _formatSingleton(handleName: string, value: DescriptionValue): any;
    _formatDescription(handleConnection: any): any;
    _formatDescriptionPattern(handleConnection: any): any;
    _formatStoreDescription(handleConn: any): string | undefined;
    _formatHandleType(handleConnection: any): any;
    _selectHandleConnection(recipeHandle: any): any;
    static sort(p1: any, p2: any): number;
}
