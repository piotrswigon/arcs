import { Strategy } from '../../planning/strategizer.js';
import { Walker } from '../recipe/walker.js';
import { Arc } from '../arc.js';
export declare class GroupHandleConnections extends Strategy {
    _walker: Walker;
    constructor(arc?: Arc, args?: any);
    readonly walker: Walker;
    generate(inputParams: any): any;
}
