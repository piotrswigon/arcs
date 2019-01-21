import { Comparable } from './util.js';
import { ParticleSpec } from '../particle-spec.js';
import { Handle } from './handle.js';
import { Direction } from './handle-connection.js';
export declare abstract class EndPoint implements Comparable {
    abstract _compareTo(other: any): number;
    abstract _clone(cloneMap?: any): any;
    abstract toString(nameMap?: any): any;
}
export declare class ParticleEndPoint extends EndPoint {
    particle: ParticleSpec;
    connection: string;
    constructor(particle: ParticleSpec, connection: string);
    _clone(cloneMap?: any): ParticleEndPoint;
    _compareTo(other: any): number;
    toString(nameMap?: any): string;
}
export declare class InstanceEndPoint extends EndPoint {
    instance: EndPoint;
    connection: string;
    constructor(instance: EndPoint, connection: string);
    _clone(cloneMap: any): InstanceEndPoint;
    _compareTo(other: any): any;
    toString(nameMap: any): string;
}
export declare class HandleEndPoint extends EndPoint {
    readonly handle: Handle;
    constructor(handle: Handle);
    _clone(cloneMap?: any): HandleEndPoint;
    _compareTo(other: any): any;
    toString(nameMap?: any): string;
}
export declare class TagEndPoint extends EndPoint {
    readonly tags: string[];
    constructor(tags: string[]);
    _clone(cloneMap?: any): TagEndPoint;
    _compareTo(other: any): any;
    toString(nameMap?: any): string;
}
export declare class ConnectionConstraint {
    from: EndPoint;
    to: EndPoint;
    direction: Direction;
    type: 'constraint' | 'obligation';
    constructor(fromConnection: EndPoint, toConnection: EndPoint, direction: Direction, type: 'constraint' | 'obligation');
    _copyInto(recipe: any, cloneMap: any): any;
    _compareTo(other: any): any;
    toString(nameMap?: any, options?: any): string;
}
