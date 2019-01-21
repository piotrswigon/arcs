import { Strategy } from '../../planning/strategizer.js';
import { StorageProviderBase } from '../storage/storage-provider-base.js';
export declare class AssignHandles extends Strategy {
    generate(inputParams: any): any;
    getMappableStores(fate: any, type: any, tags: any, counts: any): Map<StorageProviderBase, string>;
}
