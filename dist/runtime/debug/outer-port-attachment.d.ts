export declare class OuterPortAttachment {
    private arcDevtoolsChannel;
    private speculative;
    constructor(arc: any, devtoolsChannel: any);
    handlePecMessage(name: any, pecMsgBody: any, pecMsgCount: any, stackString: any): void;
    _extractStackFrames(stackString: any): any[];
}
