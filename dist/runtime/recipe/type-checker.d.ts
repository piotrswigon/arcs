export declare class TypeChecker {
    static processTypeList(baseType: any, list: any): any;
    static _tryMergeTypeVariable(base: any, onto: any): any;
    static _tryMergeConstraints(handleType: any, { type, direction }: {
        type: any;
        direction: any;
    }): boolean;
    static _writeConstraintsApply(handleType: any, connectionType: any): boolean;
    static _readConstraintsApply(handleType: any, connectionType: any): boolean;
    static compareTypes(left: any, right: any): any;
}
