export declare class SlotInfo {
    formFactor: string;
    handle: string;
    constructor(formFactor: string, handle: string);
    toLiteral(): this;
    static fromLiteral(data: any): SlotInfo;
}
