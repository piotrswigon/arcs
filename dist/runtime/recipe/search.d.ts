export declare class Search {
    _phrase: string;
    _unresolvedTokens: string[];
    _resolvedTokens: string[];
    constructor(phrase: string, unresolvedTokens?: any);
    _append(phrase: any, unresolvedTokens: any, resolvedTokens: any): void;
    readonly phrase: string;
    readonly unresolvedTokens: string[];
    readonly resolvedTokens: string[];
    resolveToken(token: any): void;
    isValid(): boolean;
    isResolved(): boolean;
    _normalize(): void;
    _copyInto(recipe: any): any;
    toString(options: any): string;
}
