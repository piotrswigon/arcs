import { WalkerBase } from './walker-base.js';
import { Recipe } from './recipe';
import { ConnectionConstraint } from './connection-constraint.js';
export declare class ConstraintWalker extends WalkerBase {
    onConstraint?(recipe: Recipe, constraint: ConnectionConstraint): any;
    onResult(result: any): void;
}
