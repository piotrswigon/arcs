import { ConnectionConstraint } from './connection-constraint.js';
import { Handle } from './handle.js';
import { HandleConnection } from './handle-connection.js';
import { Particle } from './particle.js';
import { Recipe } from './recipe.js';
import { Slot } from './slot.js';
import { SlotConnection } from './slot-connection.js';
import { WalkerBase, WalkerTactic } from './walker-base.js';
export declare class Walker extends WalkerBase {
    static Permuted: WalkerTactic;
    static Independent: WalkerTactic;
    onHandle?(recipe: Recipe, handle: Handle): any;
    onHandleConnection?(recipe: Recipe, handleConnection: HandleConnection): any;
    onParticle?(recipe: Recipe, particle: Particle): any;
    onRecipe?(recipe: Recipe, result: any): any;
    onSlotConnection?(recipe: Recipe, slotConnection: SlotConnection): any;
    onSlot?(recipe: Recipe, slot: Slot): any;
    onObligation?(recipe: Recipe, obligation: ConnectionConstraint): any;
    onResult(result: any): void;
}
