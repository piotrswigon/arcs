import { SlotConnection } from './slot-connection.js';
import { Recipe } from './recipe.js';
import { HandleConnection } from './handle-connection.js';
export declare class Slot {
    private readonly _recipe;
    private _id;
    private _localName;
    _name: string;
    private _tags;
    _sourceConnection: SlotConnection | undefined;
    private _formFactor;
    private _handleConnections;
    private _consumeConnections;
    constructor(recipe: any, name: any);
    readonly recipe: Recipe;
    id: string;
    localName: string;
    name: string;
    tags: string[];
    formFactor: string;
    readonly handleConnections: HandleConnection[];
    sourceConnection: SlotConnection;
    readonly consumeConnections: SlotConnection[];
    readonly spec: import("../particle-spec.js").ProvidedSlotSpec | {
        isSet: boolean;
        tags: any[];
    };
    readonly handles: import("./handle.js").Handle[];
    _copyInto(recipe: any, cloneMap: any): any;
    _startNormalize(): void;
    _finishNormalize(): void;
    _compareTo(other: any): any;
    findHandleByID(id: any): import("./handle.js").Handle;
    removeConsumeConnection(slotConnection: any): void;
    remove(): void;
    isResolved(options?: any): boolean;
    _isValid(options: any): boolean;
    toString(nameMap: any, options: any): string;
}
