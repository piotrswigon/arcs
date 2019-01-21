export declare abstract class Entity {
    private userIDComponent?;
    protected rawData: any;
    protected constructor(userIDComponent?: string);
    readonly data: any;
    getUserID(): string;
    isIdentified(): boolean;
    readonly id: any;
    identify(identifier: any): void;
    createIdentity(components: any): void;
    toLiteral(): any;
}
