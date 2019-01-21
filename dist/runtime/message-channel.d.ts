/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
export declare class MessagePort {
    readonly _channel: MessageChannel;
    readonly _id: number;
    readonly _other: number;
    _onmessage: (e: MessageEvent) => void | undefined;
    constructor(channel: any, id: any, other: any);
    postMessage(message: any): void;
    onmessage: (e: MessageEvent) => void;
    close(): void;
}
declare class MessageEvent {
    data: {};
    constructor(message: {});
}
export declare class MessageChannel {
    port1: MessagePort;
    port2: MessagePort;
    _ports: MessagePort[];
    constructor();
    _post(id: number, message: {}): Promise<void>;
}
export {};
