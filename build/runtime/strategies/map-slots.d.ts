import { Strategy } from '../../planning/strategizer.js';
import { SlotConnection } from '../recipe/slot-connection.js';
export declare class MapSlots extends Strategy {
    generate(inputParams: any): any;
    static connectSlotConnection(slotConnection: any, selectedSlot: any): void;
    static findAllSlotCandidates(slotConnection: any, arc: any): {
        local: any;
        remote: any;
    };
    static _findSlotCandidates(slotConnection: SlotConnection, slots: any): any;
    static slotMatches(slotConnection: SlotConnection, slot: any): boolean;
    static specMatch(slotConnection: any, slot: any): boolean;
    static tagsOrNameMatch(slotConnection: any, slot: any): boolean;
    static handlesMatch(slotConnection: SlotConnection, slot: any): boolean;
}
