import { Schema } from './schema.js';
import { TypeVariableInfo } from './type-variable-info.js';
import { InterfaceInfo } from './interface-info.js';
import { SlotInfo } from './slot-info.js';
import { ArcInfo } from './synthetic-types.js';
import { Id } from './id.js';
export declare type TypeLiteral = {
    tag: string;
    data?: any;
};
export declare abstract class Type {
    tag: 'Entity' | 'TypeVariable' | 'Collection' | 'BigCollection' | 'Relation' | 'Interface' | 'Slot' | 'Reference' | 'Arc' | 'Handle';
    protected constructor(tag: any);
    static fromLiteral(literal: TypeLiteral): Type;
    abstract toLiteral(): TypeLiteral;
    static unwrapPair(type1: Type, type2: Type): any;
    /** Tests whether two types' constraints are compatible with each other. */
    static canMergeConstraints(type1: any, type2: any): boolean;
    static _canMergeCanReadSubset(type1: any, type2: any): boolean;
    static _canMergeCanWriteSuperset(type1: any, type2: any): boolean;
    equals(type: any): any;
    isResolved(): boolean;
    mergeTypeVariablesByName(variableMap: Map<string, Type>): Type;
    _applyExistenceTypeTest(test: any): any;
    readonly hasVariable: any;
    readonly hasUnresolvedVariable: any;
    primitiveType(): any;
    getContainedType(): any;
    isTypeContainer(): boolean;
    collectionOf(): CollectionType;
    bigCollectionOf(): BigCollectionType;
    resolvedType(): Type;
    canEnsureResolved(): boolean;
    protected _canEnsureResolved(): boolean;
    maybeEnsureResolved(): boolean;
    readonly canWriteSuperset: Type;
    readonly canReadSubset: Type;
    isMoreSpecificThan(type: any): void;
    protected _isMoreSpecificThan(type: any): void;
    /**
     * Clone a type object.
     * When cloning multiple types, variables that were associated with the same name
     * before cloning should still be associated after cloning. To maintain this
     * property, create a Map() and pass it into all clone calls in the group.
     */
    clone(variableMap: any): Type;
    protected _clone(variableMap: any): Type;
    /**
     * Clone a type object, maintaining resolution information.
     * This function SHOULD NOT BE USED at the type level. In order for type variable
     * information to be maintained correctly, an entire context root needs to be
     * cloned.
     */
    _cloneWithResolutions(variableMap: any): Type;
    hasProperty(property: any): any;
    protected _hasProperty(property: any): boolean;
    toString(options?: any): string;
    getEntitySchema(): any;
    toPrettyString(): any;
}
export declare class EntityType extends Type {
    readonly entitySchema: Schema;
    constructor(schema: Schema);
    static make(names: string[], fields: {}, description?: any): EntityType;
    readonly isEntity: boolean;
    readonly canWriteSuperset: this;
    readonly canReadSubset: this;
    _isMoreSpecificThan(type: any): boolean;
    toLiteral(): {
        tag: "Entity" | "TypeVariable" | "Collection" | "BigCollection" | "Relation" | "Interface" | "Slot" | "Reference" | "Arc" | "Handle";
        data: {
            names: string[];
            fields: {};
            description: {
                [index: string]: string;
            };
        };
    };
    toString(options?: any): string;
    getEntitySchema(): Schema;
    toPrettyString(): string;
}
export declare class TypeVariable extends Type {
    readonly variable: TypeVariableInfo;
    constructor(variable: TypeVariableInfo);
    static make(name: string, canWriteSuperset?: Type, canReadSubset?: Type): TypeVariable;
    readonly isVariable: boolean;
    mergeTypeVariablesByName(variableMap: Map<string, Type>): Type;
    resolvedType(): any;
    _canEnsureResolved(): boolean;
    maybeEnsureResolved(): boolean;
    readonly canWriteSuperset: any;
    readonly canReadSubset: any;
    _clone(variableMap: any): TypeVariable;
    _cloneWithResolutions(variableMap: any): TypeVariable;
    toLiteral(): TypeLiteral;
    toString(options?: any): string;
    getEntitySchema(): any;
    toPrettyString(): any;
}
export declare class CollectionType extends Type {
    readonly collectionType: Type;
    constructor(collectionType: Type);
    readonly isCollection: boolean;
    mergeTypeVariablesByName(variableMap: Map<string, Type>): CollectionType;
    _applyExistenceTypeTest(test: any): any;
    primitiveType(): Type;
    getContainedType(): Type;
    isTypeContainer(): boolean;
    resolvedType(): CollectionType;
    _canEnsureResolved(): boolean;
    maybeEnsureResolved(): boolean;
    _clone(variableMap: any): Type;
    _cloneWithResolutions(variableMap: any): CollectionType;
    toLiteral(): {
        tag: "Entity" | "TypeVariable" | "Collection" | "BigCollection" | "Relation" | "Interface" | "Slot" | "Reference" | "Arc" | "Handle";
        data: TypeLiteral;
    };
    _hasProperty(property: any): any;
    toString(options?: any): string;
    getEntitySchema(): any;
    toPrettyString(): any;
}
export declare class BigCollectionType extends Type {
    readonly bigCollectionType: Type;
    constructor(bigCollectionType: Type);
    readonly isBigCollection: boolean;
    mergeTypeVariablesByName(variableMap: Map<string, Type>): BigCollectionType;
    _applyExistenceTypeTest(test: any): any;
    getContainedType(): Type;
    isTypeContainer(): boolean;
    resolvedType(): BigCollectionType;
    _canEnsureResolved(): boolean;
    maybeEnsureResolved(): boolean;
    _clone(variableMap: any): Type;
    _cloneWithResolutions(variableMap: any): BigCollectionType;
    toLiteral(): {
        tag: "Entity" | "TypeVariable" | "Collection" | "BigCollection" | "Relation" | "Interface" | "Slot" | "Reference" | "Arc" | "Handle";
        data: TypeLiteral;
    };
    _hasProperty(property: any): any;
    toString(options?: any): string;
    getEntitySchema(): any;
    toPrettyString(): any;
}
export declare class RelationType extends Type {
    readonly relationEntities: Type[];
    constructor(relation: Type[]);
    readonly isRelation: boolean;
    toLiteral(): {
        tag: "Entity" | "TypeVariable" | "Collection" | "BigCollection" | "Relation" | "Interface" | "Slot" | "Reference" | "Arc" | "Handle";
        data: TypeLiteral[];
    };
    toPrettyString(): string;
}
export declare class InterfaceType extends Type {
    readonly interfaceInfo: InterfaceInfo;
    constructor(iface: InterfaceInfo);
    static make(name: string, handles: any, slots: any): InterfaceType;
    readonly isInterface: boolean;
    mergeTypeVariablesByName(variableMap: Map<string, Type>): InterfaceType;
    _applyExistenceTypeTest(test: any): boolean;
    resolvedType(): InterfaceType;
    _canEnsureResolved(): boolean;
    maybeEnsureResolved(): boolean;
    readonly canWriteSuperset: InterfaceType;
    readonly canReadSubset: InterfaceType;
    _isMoreSpecificThan(type: any): boolean;
    _clone(variableMap: any): Type;
    _cloneWithResolutions(variableMap: any): InterfaceType;
    toLiteral(): {
        tag: "Entity" | "TypeVariable" | "Collection" | "BigCollection" | "Relation" | "Interface" | "Slot" | "Reference" | "Arc" | "Handle";
        data: {
            name: string;
            handles: {
                type: any;
                name: any;
                direction: any;
            }[];
            slots: {
                name: any;
                direction: any;
                isRequired: any;
                isSet: any;
            }[];
        };
    };
    toString(options?: any): string;
    toPrettyString(): string;
}
export declare class SlotType extends Type {
    readonly slot: SlotInfo;
    constructor(slot: SlotInfo);
    static make(formFactor: string, handle: string): SlotType;
    readonly isSlot: boolean;
    readonly canWriteSuperset: this;
    readonly canReadSubset: this;
    _isMoreSpecificThan(type: any): boolean;
    toLiteral(): {
        tag: "Entity" | "TypeVariable" | "Collection" | "BigCollection" | "Relation" | "Interface" | "Slot" | "Reference" | "Arc" | "Handle";
        data: SlotInfo;
    };
    toString(options?: any): string;
    toPrettyString(): string;
}
export declare class ReferenceType extends Type {
    readonly referredType: Type;
    constructor(reference: Type);
    readonly isReference: boolean;
    getContainedType(): Type;
    isTypeContainer(): boolean;
    resolvedType(): ReferenceType;
    _canEnsureResolved(): boolean;
    maybeEnsureResolved(): boolean;
    readonly canReadSubset: Type;
    _clone(variableMap: any): Type;
    _cloneWithResolutions(variableMap: any): ReferenceType;
    toLiteral(): {
        tag: "Entity" | "TypeVariable" | "Collection" | "BigCollection" | "Relation" | "Interface" | "Slot" | "Reference" | "Arc" | "Handle";
        data: TypeLiteral;
    };
    toString(options?: any): string;
}
export declare class ArcType extends Type {
    constructor();
    readonly isArc: boolean;
    newInstance(arcId: Id, serialization: string): ArcInfo;
    toLiteral(): {
        tag: "Entity" | "TypeVariable" | "Collection" | "BigCollection" | "Relation" | "Interface" | "Slot" | "Reference" | "Arc" | "Handle";
    };
}
export declare class HandleType extends Type {
    constructor();
    readonly isHandle: boolean;
    toLiteral(): {
        tag: "Entity" | "TypeVariable" | "Collection" | "BigCollection" | "Relation" | "Interface" | "Slot" | "Reference" | "Arc" | "Handle";
    };
}
