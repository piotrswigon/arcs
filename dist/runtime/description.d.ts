import { Arc } from './arc.js';
import { Recipe } from './recipe/recipe.js';
import { Handle } from './recipe/handle.js';
import { Particle } from './recipe/particle.js';
import { HandleConnection } from './recipe/handle-connection.js';
import { StorageProviderBase } from './storage/storage-provider-base.js';
export declare class Description {
    relevance: {} | null;
    readonly arc: Arc;
    _particle: Particle | undefined;
    constructor(arc: any);
    getArcDescription(formatterClass?: typeof DescriptionFormatter): Promise<string>;
    getRecipeSuggestion(formatterClass?: typeof DescriptionFormatter): Promise<any>;
    getHandleDescription(recipeHandle: any): Promise<any>;
    static defaultDescription: string;
}
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
    _store: StorageProviderBase;
};
export declare type CombinedDescriptionsOptions = {
    skipFormatting?: boolean;
};
export declare class DescriptionFormatter {
    private description;
    private arc;
    private particleDescriptions;
    private seenHandles;
    seenParticles: Set<Particle>;
    excludeValues: boolean;
    constructor(description: any);
    getDescription(recipe: Recipe): Promise<any>;
    _isSelectedDescription(desc: ParticleDescription): boolean;
    getHandleDescription(recipeHandle: Handle): Promise<any>;
    _updateDescriptionHandles(description: Description): Promise<void>;
    _createParticleDescription(particle: Particle, relevance: any): Promise<ParticleDescription>;
    _getPatternByNameFromDescriptionHandle(particle: any): Promise<{}>;
    _populateParticleDescription(particle: any, descriptionByName: any): {
        pattern: any;
    } | {
        pattern?: undefined;
    };
    _combineSelectedDescriptions(selectedDescriptions: ParticleDescription[], options?: CombinedDescriptionsOptions): Promise<any>;
    _joinDescriptions(strings: any): any;
    _joinTokens(tokens: any): any;
    _capitalizeAndPunctuate(sentence: any): string;
    patternToSuggestion(pattern: any, particleDescription: any): any;
    _initTokens(pattern: any, particleDescription: any): any[];
    _initSubTokens(pattern: any, particleDescription: any): {}[];
    tokenToString(token: any): any;
    _particleTokenToString(token: any): Promise<any>;
    _handleTokenToString(token: any): any;
    _combineDescriptionAndValue(token: any, description: any, storeValue: any): any;
    _slotTokenToString(token: any): Promise<any>;
    _propertyTokenToString(handleName: any, store: any, properties: any): Promise<any>;
    _formatEntityProperty(handleName: any, properties: any, value: any): any;
    _formatStoreValue(handleName: any, store: any): Promise<any>;
    _formatCollection(handleName: any, values: any): any;
    _formatBigCollection(handleName: any, firstValue: any): any;
    _formatSingleton(handleName: any, value: any, handleDescription: any): any;
    _formatDescription(handleConnection: any, store: any): any;
    _formatDescriptionPattern(handleConnection: any): any;
    _formatStoreDescription(handleConn: any, store: any): any;
    _formatHandleType(handleConnection: any): any;
    _selectHandleConnection(recipeHandle: any): any;
    static sort(p1: any, p2: any): number;
}
