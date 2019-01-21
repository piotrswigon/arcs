import { Strategy } from '../../planning/strategizer.js';
import { Arc } from '../arc.js';
import { Modality } from '../modality.js';
export declare class ConvertConstraintsToConnections extends Strategy {
    modality: Modality;
    constructor(arc: Arc, args?: any);
    generate(inputParams: any): any;
}
