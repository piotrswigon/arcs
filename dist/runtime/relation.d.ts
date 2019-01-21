import { Entity } from './entity.js';
export declare class Relation extends Entity {
    entities: Entity[];
    constructor(...entities: any[]);
    readonly data: any[];
}
