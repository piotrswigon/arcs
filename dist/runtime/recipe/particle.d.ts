import { SlotConnection } from './slot-connection.js';
import { HandleConnection } from './handle-connection.js';
import { Recipe } from './recipe.js';
import { ParticleSpec } from '../particle-spec.js';
export declare class Particle {
    private readonly _recipe;
    private _id;
    private _name;
    private _localName;
    private _spec;
    private _verbs;
    private _connections;
    _unnamedConnections: HandleConnection[];
    _consumedSlotConnections: {
        [index: string]: SlotConnection;
    };
    constructor(recipe: Recipe, name: string);
    _copyInto(recipe: Recipe, cloneMap: any): Particle;
    _cloneConnectionRawTypes(): void;
    _startNormalize(): void;
    _finishNormalize(): void;
    _compareTo(other: any): any;
    _isValid(options: any): boolean;
    isResolved(options?: any): boolean;
    readonly recipe: Recipe;
    localName: string;
    id: string;
    name: string;
    spec: ParticleSpec;
    readonly connections: {
        [index: string]: HandleConnection;
    };
    readonly unnamedConnections: HandleConnection[];
    readonly consumedSlotConnections: {
        [index: string]: SlotConnection;
    };
    readonly primaryVerb: string;
    verbs: any;
    addUnnamedConnection(): HandleConnection;
    addConnectionName(name: any): HandleConnection;
    allConnections(): HandleConnection[];
    ensureConnectionName(name: any): HandleConnection;
    getConnectionByName(name: any): HandleConnection;
    nameConnection(connection: any, name: any): void;
    addSlotConnection(name: any): SlotConnection;
    removeSlotConnection(slotConnection: any): void;
    remove(): void;
    toString(nameMap: any, options: any): string;
}
