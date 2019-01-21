import { Recipe } from './recipe.js';
import { Particle } from './particle.js';
import { SlotSpec } from '../particle-spec.js';
import { Slot } from './slot.js';
export declare class SlotConnection {
    private readonly _recipe;
    private readonly _particle;
    private readonly _name;
    private _slotSpec;
    private _targetSlot;
    private _providedSlots;
    private _tags;
    constructor(name: any, particle: any);
    remove(): void;
    readonly recipe: Recipe;
    readonly particle: Particle;
    readonly name: string;
    getQualifiedName(): string;
    slotSpec: SlotSpec;
    targetSlot: Slot | undefined;
    readonly providedSlots: {
        [index: string]: Slot;
    };
    tags: string[];
    connectToSlot(targetSlot: any): void;
    disconnectFromSlot(): void;
    _clone(particle: any, cloneMap: any): any;
    _normalize(): void;
    _compareTo(other: any): any;
    _isValid(options: any): boolean;
    isResolved(options?: any): boolean;
    isConnectedToInternalSlot(): boolean;
    isConnectedToRemoteSlot(): boolean;
    isConnected(): boolean;
    toString(nameMap: any, options: any): string;
}
