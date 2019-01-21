import { Type } from './type.js';
import { Id } from './id.js';
export declare class ArcInfo {
    readonly id: string;
    readonly serialization: string;
    constructor(arcId: Id, serialization: string);
    static extractSerialization(data: any): any;
}
export declare class ArcHandle {
    readonly storageKey: string;
    readonly type: Type;
    readonly tags: string[];
    constructor(storageKey: any, type: any, tags: any);
}
