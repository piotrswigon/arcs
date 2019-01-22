/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
export declare class OuterPortAttachment {
    private arcDevtoolsChannel;
    private speculative;
    constructor(arc: any, devtoolsChannel: any);
    handlePecMessage(name: any, pecMsgBody: any, pecMsgCount: any, stackString: any): void;
    _extractStackFrames(stackString: any): any[];
}
