import { Type } from './type.js';
export declare class TypeVariableInfo {
    name: string;
    _canWriteSuperset: Type | null;
    _canReadSubset: Type | null;
    _resolution: Type | null;
    constructor(name: string, canWriteSuperset: Type | null, canReadSubset: Type | null);
    /**
     * Merge both the read subset (upper bound) and write superset (lower bound) constraints
     * of two variables together. Use this when two separate type variables need to resolve
     * to the same value.
     */
    maybeMergeConstraints(variable: TypeVariableInfo): boolean;
    /**
     * Merge a type variable's read subset (upper bound) constraints into this variable.
     * This is used to accumulate read constraints when resolving a handle's type.
     */
    maybeMergeCanReadSubset(constraint: any): boolean;
    /**
     * merge a type variable's write superset (lower bound) constraints into this variable.
     * This is used to accumulate write constraints when resolving a handle's type.
     */
    maybeMergeCanWriteSuperset(constraint: any): boolean;
    isSatisfiedBy(type: any): boolean;
    resolution: Type;
    isValidResolutionCandidate(value: Type): {
        result: boolean;
        detail?: string;
    };
    canWriteSuperset: any;
    canReadSubset: any;
    readonly hasConstraint: boolean;
    canEnsureResolved(): boolean;
    maybeEnsureResolved(): boolean;
    toLiteral(): {
        name: string;
        canWriteSuperset: import("./type.js").TypeLiteral;
        canReadSubset: import("./type.js").TypeLiteral;
    };
    toLiteralIgnoringResolutions(): {
        name: string;
        canWriteSuperset: import("./type.js").TypeLiteral;
        canReadSubset: import("./type.js").TypeLiteral;
    };
    static fromLiteral(data: any): TypeVariableInfo;
    isResolved(): boolean;
}
