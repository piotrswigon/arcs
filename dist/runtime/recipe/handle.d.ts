import { Type } from '../type.js';
import { Recipe } from './recipe.js';
import { HandleConnection } from './handle-connection.js';
import { ParticleSpec } from '../particle-spec.js';
declare type Fate = 'use' | 'create' | 'map' | 'copy' | '?' | '`slot';
export declare class Handle {
    private readonly _recipe;
    private _id;
    private _localName;
    private _tags;
    _type: Type | undefined;
    private _fate;
    private _originalFate;
    private _originalId;
    private _connections;
    private _mappedType;
    private _storageKey;
    private _pattern;
    private _immediateValue;
    constructor(recipe: Recipe);
    _copyInto(recipe: Recipe): any;
    mergeInto(handle: any): void;
    _mergedFate(fates: any): "use" | "create";
    _startNormalize(): void;
    _finishNormalize(): void;
    _compareTo(other: any): any;
    fate: Fate;
    readonly originalFate: Fate;
    readonly originalId: string | null;
    readonly recipe: Recipe;
    tags: string[];
    readonly type: Type;
    id: string | null;
    mapToStorage(storage: any): void;
    localName: string;
    readonly connections: HandleConnection[];
    storageKey: string;
    pattern: string;
    mappedType: Type;
    immediateValue: ParticleSpec;
    static effectiveType(handleType: any, connections: any): any;
    static resolveEffectiveType(handleType: any, connections: any): any;
    _isValid(options: any): boolean;
    isResolved(options?: any): boolean;
    toString(nameMap: any, options: any): string;
    findConnectionByDirection(dir: string): HandleConnection;
}
export {};
