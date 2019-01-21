/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
export declare class Id {
    private session;
    private readonly currentSession;
    private nextIdComponent;
    private readonly components;
    constructor(currentSession: string, components?: string[]);
    static newSessionId(): Id;
    /**
     * When used in the following way:
     *   const id = Id.newSessionId().fromString(stringId);
     *
     * The resulting id will receive a newly generated session id in the currentSession field,
     * while maintaining an original session from the string representation in the session field.
     */
    fromString(str: string): Id;
    toString(): string;
    toStringWithoutSessionForTesting(): string;
    createId(component?: string): Id;
    equal(id: Id): boolean;
}
